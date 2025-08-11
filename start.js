import { wait_for_script, copy_files, list_servers } from "/utils/functions.js";
import { FNAMES } from "/utils/constants.js";

/** @param {NS} ns */
export async function main(ns) {
  const { currentNode, ownedAugs, ownedSF } = ns.getResetInfo();
  ns.write(FNAMES.augments, JSON.stringify(ownedAugs), 'w');
  ns.write(FNAMES.sourceFiles, JSON.stringify(ownedSF), 'w');

  let mults = {
    "ScriptHackMoney": 1.0,
    "ServerGrowthRate": 1.0,
    "ServerWeakenRate": 1.0,
    "HackingSpeedMultiplier": 1.0
  };
  ns.write(FNAMES.bitnode, JSON.stringify(mults), 'w');
  if (currentNode == 5 || ownedSF.has('SF5')) {  // requires BitNode 5 or have Source-File 5
    ns.run('/utils/real-bitnode-mults.js');
  }

  mults = ns.getHackingMultipliers();
  ns.write(FNAMES.hackMults, JSON.stringify(mults), 'w');

  let servers = list_servers(ns);
  for (let name of servers) {
    if (name != 'home')
      copy_files(ns, name);
  }

  ns.tprint('running scan-root.js');
  await wait_for_script(ns, 'scan-root.js');

  switch (currentNode) {
    case 1:
      ns.tprint('Study algorithms');
      if (ns.getServerMaxRam('home') < 16) {
        ns.run('/utils/bitnode1-8gb.js');
      } else {
        ns.run('/utils/bitnode1.js');
      }
  }
}
