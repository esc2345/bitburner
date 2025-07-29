import { list_servers, estimate_grow_cycles, estimate_hack_percent } from "utils/functions.js";

const MEM_W = 1.75, MEM_G = 1.75, MEM_H = 1.70;
const WEAKEN_EFFECT = 0.05, GROW_EFFECT = 2 * 0.002, HACK_EFFECT = 0.002;
const SLEEP_TIME = 30;


function getServers(ns) {
  return list_servers(ns).filter(s => ns.getServer(s).hasAdminRights);
}


async function doTasks(ns, tasks, targetName) {
  let servers = getServers(ns);
  let serverIndex = 0;

  for (const task of tasks) {
    if (task !== undefined) {
      let script, mem, threads = task.threads;
      switch (task.type) {
        case 'weaken': script = 'scripts/weaken.js'; mem = MEM_W; break;
        case 'grow': script = 'scripts/grow.js'; mem = MEM_G; break;
        case 'hack': script = 'scripts/hack.js'; mem = MEM_H; break;
        default: throw `invalid type: ${task}`;
      }
      while (threads > 0) {
        const s = ns.getServer(servers[serverIndex]);
        let serverMem = (s.maxRam - s.ramUsed);
        if (s.hostname == 'home')
          serverMem -= 6;
        const n = Math.min(Math.floor(serverMem / mem), threads);
        const time = ns.getWeakenTime(targetName);
        if (n > 0 && ns.exec(script, s.hostname, n, targetName, time)) {
          threads -= n;
        }
        serverIndex++;
        if (serverIndex >= servers.length) {
          serverIndex = 0;
          if (ns.peek(1) != 'NULL PORT DATA' && ns.peek(1) > servers.length) {
            ns.tprint(`target: ${targetName}, reloading servers`);
            servers = getServers(ns);
          }
          await ns.sleep(SLEEP_TIME * 10);
        }
      }
      await ns.sleep(SLEEP_TIME);
    }
  }
}


async function prep(ns, targetServer) {
  const t = targetServer;
  let tasks = [];
  if (t.hackDifficulty > t.minDifficulty) {
    tasks.push({
      'type': 'weaken',
      'threads': Math.ceil((t.hackDifficulty - t.minDifficulty) / WEAKEN_EFFECT)
    });
  }
  if (t.moneyAvailable < t.moneyMax) {
    const threads = Math.floor(WEAKEN_EFFECT / GROW_EFFECT); // weaken : grow
    const cycles = estimate_grow_cycles(ns, t, t.moneyMax / t.moneyAvailable, threads);
    //ns.tprint(`grow cycles: ${cycles} ${estimate_grow_cycles(ns, t, 1)}`);
    //ns.tprint(ns.growthAnalyze(t.hostname, t.moneyMax/t.moneyAvailable));
    for (let i = 0; i < cycles; i++) {
      tasks.push({ 'type': 'grow', 'threads': threads });
      tasks.push({ 'type': 'weaken', 'threads': 1 });
    }
  }
  //ns.tprint(tasks);
  await doTasks(ns, tasks, t.hostname);
}


async function prepAll(ns) {
  let targets = getServers(ns)
    .filter(name => {
      const t = ns.getServer(name);
      return t.hasAdminRights && name.indexOf('home') != 0 && t.moneyMax && t.moneyMax > 0
      })
    .sort((a, b) => ns.getServer(a).requiredHackingSkill - ns.getServer(b).requiredHackingSkill);
  ns.tprint(`(${ns.pid}) ${targets}`);
  for (const name of targets) {
    ns.tprint(`(${ns.pid}) ${name}`);
    await prep(ns, ns.getServer(name));
  }
}


async function hackLoop(ns, targetServer) {
  let tasks = [];
  const hackPct = estimate_hack_percent(ns, targetServer);
  const gThreads = estimate_grow_cycles(ns, targetServer, 1 / (1 - hackPct), 1);
  const wThreads = Math.ceil((gThreads * GROW_EFFECT + HACK_EFFECT) / WEAKEN_EFFECT);
  tasks.push({ 'type': 'hack', 'threads': 1 });
  tasks.push({ 'type': 'grow', 'threads': gThreads });
  tasks.push({ 'type': 'weaken', 'threads': wThreads });
  do {
    await doTasks(ns, tasks, targetServer.hostname);
  } while (true)
}


/** @param {NS} ns **/
export async function main(ns) {
  const args = ns.flags([['h', false], ['all', false], ['loop', false]]);
  //ns.tprint(args);
  if (args.h || (args._.length == 0 && !args.all)) {
    ns.tprint(`
Weakens a target server or all servers to minimum security and grows to max money.
Optionally hacks in a loop after weaken and grow.
USAGE ${ns.getScriptName()} target_name --all? --loop? `);
    return;
  }
  if (args.all) {
    ns.tprint(`(${ns.pid}) prepping all servers`);
    await prepAll(ns);
  }
  if (args._.length > 0) {
    const t = ns.getServer(args._[0]);
    if (t.hostname == 'home' || t.moneyMax == 0) {
      ns.tprint('invalid target');
      return;
    } else {
      ns.tprint(`(${ns.pid}) prepping ${t.hostname}`);
      await prep(ns, t);
      if (args.loop) {
        ns.tprint(`(${ns.pid}) hacking ${t.hostname}`);
        await hackLoop(ns, t);
      }
    }
  }
}


/**
 * @param {AutocompleteData} data - context about the game, useful when autocompleting
 * @param {string[]} args - current arguments, not including "run script.js"
 * @returns {string[]} - the array of possible autocomplete options
 */
export function autocomplete(data, args) {
  // Example: Suggest server names based on user input
  if (args.length >= 1) {
    return data.servers.concat(['--all', '--loop']); // Suggest all server names
  }
  return []; // No suggestions if no relevant input
}
