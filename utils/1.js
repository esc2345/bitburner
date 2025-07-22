import { copy_files, list_servers } from "/utils/functions.js";

/** @param {NS} ns */
export async function main(ns) {
  ns.tprint('.');
  let mults = {
    "ScriptHackMoney": 1.0,
    "ServerGrowthRate": 1.0,
    "ServerWeakenRate": 1.0,
    "HackingSpeedMultiplier": 1.0
  };
  ns.write('/temp/bitnode.txt', JSON.stringify(mults), 'w');

  if (ns.getServerMaxRam('home') > 16){
    ns.run('/utils/1a.js');
  }

  let servers = list_servers(ns);
  for (let name of servers) {
    if (name != 'home')
      copy_files(ns, name);
  }

}