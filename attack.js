import { estimate_grow_cycles, estimate_hack_percent } from "/utils/functions.js";
import { FNAMES, PORTS, MEM } from "/utils/constants.js";

var WEAKEN_EFFECT = 0.05, GROW_EFFECT = 2 * 0.002, HACK_EFFECT = 0.002;
const SLEEPTIME = 30;

class TaskRunner {
  constructor(ns, targetName) {
    this.targetName = targetName;
    this.tasks = [];
    this.loopTasks = [];
    this.servers = [];
    this.time = 0;
  }
  makeTasks(ns, loopOnly = false) {
    this.time = Math.ceil(ns.getWeakenTime(this.targetName));
    const targetServer = ns.getServer(this.targetName);
    // hacking
    const numHacks = 1;
    const hackPct = estimate_hack_percent(ns, targetServer);
    const gThreads = estimate_grow_cycles(ns, targetServer, 1 / (1 - (numHacks * hackPct)), 1);
    const wThreads = Math.ceil((gThreads * GROW_EFFECT + HACK_EFFECT) / WEAKEN_EFFECT);
    this.loopTasks = [['weaken', wThreads], ['grow', gThreads], ['hack', numHacks]];
    if (loopOnly == false) {
      this.tasks = [['weaken', wThreads], ['grow', gThreads], ['hack', numHacks]];
      // growing
      if (targetServer.moneyAvailable < targetServer.moneyMax) {
        const threads = Math.floor(WEAKEN_EFFECT / GROW_EFFECT);
        const growth = targetServer.moneyMax / targetServer.moneyAvailable;
        const cycles = estimate_grow_cycles(ns, targetServer, growth, threads);
        //ns.tprint(`grow cycles: ${cycles} ${estimate_grow_cycles(ns, t, 1)}`);
        //ns.tprint(ns.growthAnalyze(t.hostname, t.moneyMax/t.moneyAvailable));
        for (let i = 0; i < cycles; i++) {
          this.tasks.push(['weaken', 1]);
          this.tasks.push(['grow', threads]);
        }
      }
      // weakening
      if (targetServer.hackDifficulty > targetServer.minDifficulty) {
        this.tasks.push(['weaken', Math.ceil((targetServer.hackDifficulty - targetServer.minDifficulty) / WEAKEN_EFFECT)]);
      }
    }
    return this;
  }
  getServers(ns) {
    const portData = ns.peek(PORTS.numRooted);
    if (portData != 'NULL PORT DATA' && portData > this.servers.length) {
      this.servers = JSON.parse(ns.read(FNAMES.rootedServers))
      ns.tprint(`(${ns.pid}) ${this.targetName} : servers = ${this.servers.length}`)
    }
    return this;
  }
  async start(ns, loop = true) {
    let i = 0;
    do {
      const task = this.tasks.pop();
      let script, mem, threads = task[1];
      switch (task[0]) {
        case 'weaken': script = FNAMES.weakenScript; mem = MEM.W; break;
        case 'grow': script = FNAMES.growScript; mem = MEM.G; break;
        case 'hack': script = FNAMES.hackScript; mem = MEM.H; break;
        default: throw `Invalid task: ${task}`;
      }
      while (threads > 0) {
        const s = ns.getServer(this.servers[i]);
        let ram = s.maxRam - s.ramUsed;
        if (s.hostname == 'home') ram -= 8; //reserve 8GB total on home
        let n = Math.min(threads, Math.floor(ram / mem));
        if (n > 0 && ns.exec(script, s.hostname, n, this.targetName, this.time)) {
          threads -= n;
        } else {
          if (++i >= this.servers.length) {
            await ns.sleep(SLEEPTIME * 10);
            this.getServers(ns);
            i = 0;
          }
        }
      }
      await ns.sleep(SLEEPTIME);
      if (this.tasks.length <= 0 && loop) {
          this.tasks = this.loopTasks.slice(0);
          this.makeTasks(ns, true);
      }
    } while (this.tasks.length > 0)
    return this;
  }
}


/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['h', false]]);
  if (args.h || args._.length != 1) {
    ns.tprint(`weaken, grow, hack a target server\nusage: ${ns.getScriptName()}  target_server_name`);
    return;
  }
  const t = ns.getServer(args._[0]);
  if (t.hostname.indexOf('home') == 0 || t.moneyMax == 'undefined' || t.moneyMax <= 0) {
    throw `Invalid target: ${t.hostname}`;
  }

  let taskRunner = new TaskRunner(ns, t.hostname)
    .makeTasks(ns)
    .getServers(ns);
  await taskRunner.start(ns);
}


/**
 * @param {AutocompleteData} data - context about the game, useful when autocompleting
 * @param {string[]} args - current arguments, not including "run script.js"
 * @returns {string[]} - the array of possible autocomplete options
 */
export function autocomplete(data, args) {
  if (args.length <= 1) {
    return data.servers; // Suggest all server names
  }
  return [];
}
