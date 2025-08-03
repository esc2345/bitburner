import { list_servers, estimate_hack_percent, estimate_grow_cycles } from "/utils/functions.js";

/**
 * @param {AutocompleteData} data - context about the game, useful when autocompleting
 * @param {string[]} args - current arguments, not including "run script.js"
 * @returns {string[]} - the array of possible autocomplete options
 */
export function autocomplete(data, args) {
  if (args.length >= 1 && (args[0] == '--sort' || args[0] == '-s')) {
    return ['time', 'difficulty', 'maxmoney']; // Suggest all server names
  }
  return [];
}


/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['sort', ['time', 'difficulty', 'maxmoney']], ['s', ['time', 'difficulty', 'maxmoney']]]);
  const servers = list_servers(ns).filter(n => {
    return ns.getServer(n).hasAdminRights && n.indexOf('home') != 0;
  });

  let dataTable = [];

  const totalMem = list_servers(ns).filter(n => ns.getServer(n).hasAdminRights).reduce(
    (total, name) => {
      const ram = ns.getServer(name).maxRam;
      const value = (ram) ? ram : 0;
      return total + value;
    },
    0
  );
  ns.tprint(`total memory: ${totalMem}`);
  const maxThreads = totalMem / 1.75;

  for (let sName of servers) {
    const target = ns.getServer(sName);
    const { hostname, minDifficulty, hackDifficulty,
      moneyMax, moneyAvailable, maxRam, requiredHackingSkill } = target;
    if (isNaN(moneyMax) || moneyMax == 0) continue;

    const secs = ns.getWeakenTime(sName) / 1000;

    let weakenThreads = (target.hackDifficulty - target.minDifficulty) / 0.05;

    const growCycles = estimate_grow_cycles(ns, target, moneyMax / moneyAvailable, 12);
    weakenThreads += Math.ceil(growCycles / 12);

    const hackPct = estimate_hack_percent(ns, target);
    const growThreads = estimate_grow_cycles(ns, target, 1 / (1 - hackPct), 1);
    weakenThreads += Math.ceil(growThreads / 12);

    const cycles = Math.ceil(weakenThreads / maxThreads) + growCycles +
      1 + Math.ceil(growThreads / maxThreads);

    const time = secs * cycles;
    const money = moneyMax * hackPct;
    const eps = money / time;

    dataTable.push([
      hostname,
      secs,
      moneyAvailable,
      moneyMax,
      hackDifficulty,
      minDifficulty,
      maxRam,
      cycles,
      eps,
      growCycles
    ]);
  }

  let temp = '';
  if (args.sort.length == 1) temp = args.sort[0];
  if (args.s.length == 1) temp = args.s[0];
  switch (temp) {
    case 'time':
      dataTable.sort((a, b) => b[1] - a[1]);
      break;
    case 'difficulty':
      dataTable.sort((a, b) => (b[4] - b[5]) - (a[4] - a[5]));
      break;
    case 'maxmoney':
      dataTable.sort((a, b) => b[3] - a[3]);
      break;
    default: // max money / time
      dataTable.sort((a, b) => a[8] - b[8]);
  }


  for (let row of dataTable) {
    const [
      hostname,
      secs,
      moneyAvailable,
      moneyMax,
      hackDifficulty,
      minDifficulty,
      maxRam,
      cycles,
      eps,
      growCycles
    ] = row;
    ns.tprint(` ${hostname.padEnd(19)}:` +
      ` ${(moneyAvailable / moneyMax * 100).toFixed(1).padStart(5)}%\$` +
      ` ${(hackDifficulty - minDifficulty).toFixed(3).padStart(7)},` +
      ` ${(Math.floor(secs / 60)).toFixed(0).padStart(2)}m ${(secs % 60).toFixed(0).padStart(2)}s,` +
      //` ${cycles.toString().padStart(3)}` +
      //` (${growCycles.toString().padStart(3)})` +
      ` ${ns.formatNumber(eps).padStart(8)}` +
      //`  \$${ns.formatNumber(moneyMax).padStart(8)}` +
      ` ${maxRam.toString().padStart(3)}GB`
      //` security ${Math.round(hackDifficulty)}/${minDifficulty}`
    );
  }

  //ns.tprint(args);
}