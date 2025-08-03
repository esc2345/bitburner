import { list_servers, estimate_grow_cycles } from "/utils/functions.js";
import { FNAMES, PORTS, MEM } from "/utils/constants.js";

var WEAKEN_EFFECT = 0.05, GROW_EFFECT = 2 * 0.002, HACK_EFFECT = 0.002;
const SLEEPTIME = 30;

class TaskRunner {
  constructor(ns, targetName) {
    this.targetName = targetName;
    this.tasks = [];
    this.servers = [];
    this.time = 0;
  }
  makeTasks(ns) {
    this.time = ns.getWeakenTime(this.targetName);
    const targetServer = ns.getServer(this.targetName);
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
    return this;
  }
  getServers(ns) {
    const portData = ns.peek(PORTS.numRooted);
    if (portData != 'NULL PORT DATA' && portData > this.servers.length) {
      this.servers = JSON.parse(ns.read(FNAMES.rootedServers))
    }
    return this;
  }
  async start(ns) {
    const secs = this.time / 1000;
    ns.tprint(`(${ns.pid}) ${this.targetName.padEnd(20)} ` +
      ` ${(Math.floor(secs / 60)).toFixed(0).padStart(2)}m ${(secs % 60).toFixed(0).padStart(2)}s`);
    let i = 0;
    while (this.tasks.length > 0) {
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
        let ram = s.maxRam - s.ramUsed - 2; //reserving 2GB for connect.js
        if (s.hostname == 'home') ram -= 6; //reserve 8GB total on home
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
    }
  }
}


/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['h', false]]);
  if (args.h) {
    ns.tprint(`weaken and grow all servers`);
    return;
  }
  const servers = list_servers(ns).filter(s => {
    const t = ns.getServer(s);
    return t.hasAdminRights && t.hostname.indexOf('home') < 0 && t.moneyMax > 0
  });
  servers.sort((a, b) => ns.getServer(a).requiredHackingSkill - ns.getServer(b).requiredHackingSkill);
  for (const serverName of servers) {
    let taskRunner = new TaskRunner(ns, serverName)
      .makeTasks(ns)
      .getServers(ns);
    await taskRunner.start(ns);
  }
}
