import { list_servers, estimate_grow_cycles } from "utils/functions.js";

const MEM_W = 1.75, MEM_G = 1.75, MEM_H = 1.70;
const WEAKEN_EFFECT = 0.05, GROW_EFFECT = 2 * 0.002, HACK_EFFECT = 0.002;
const SLEEP_TIME = 30;

function getServers(ns){
  return list_servers(ns).filter(s => ns.getServer(s).hasAdminRights);
}

/** @param {NS} ns **/
export async function main(ns) {
  const args = ns.flags([['h', false]]);
  const t = ns.getServer(args._[0]);
  if (t.hostname == 'home' || t.moneyMax == 0) {
    ns.tprint('invalid target');
    return;
  }

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

  let servers = getServers(ns);
  let serverIndex = 0;

  for (const task of tasks) {
    let script, mem, threads = task.threads;
    switch (task.type) {
      case 'weaken':
        script = 'scripts/weaken.js';
        mem = MEM_W;
        break;
      case 'grow':
        script = 'scripts/grow.js';
        mem = MEM_G;
        break;
      case 'hack':
        script = 'scripts/hack.js';
        mem = MEM_H;
        break;
      default:
        throw `invalid type: ${task}`;
    }
    while (threads > 0) {
      const s = ns.getServer(servers[serverIndex]);
      let serverMem = (s.maxRam - s.ramUsed);
      if (s.hostname == 'home')
        serverMem -= 128;
      const n = Math.min(Math.floor(serverMem / mem), threads);
      const time = ns.getWeakenTime(t.hostname);
      if (n > 0 && ns.exec(script, s.hostname, n, t.hostname, time)) {
        threads -= n;
      }
      serverIndex++;
      if (serverIndex >= servers.length) {
        serverIndex = 0;
        await ns.sleep(SLEEP_TIME);
      }
      let numServers = ns.peek(1);
      if (numServers != 'NULL PORT DATA' && numServers > servers.length) {
        ns.tprint(`target: ${t.hostname}, reloading servers`);
        servers = getServers(ns);
      }
    }
    await ns.sleep(SLEEP_TIME);
  }
}


/**
 * @param {AutocompleteData} data - context about the game, useful when autocompleting
 * @param {string[]} args - current arguments, not including "run script.js"
 * @returns {string[]} - the array of possible autocomplete options
 */
export function autocomplete(data, args) {
  // Example: Suggest server names based on user input
  if (args.length === 1) {
    return data.servers; // Suggest all server names
  } else if (args.length === 2 && args[0] === "--target") {
    return data.servers; // Suggest server names for the --target flag
  }
  return []; // No suggestions if no relevant input
}
