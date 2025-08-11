import { wait_for_script } from "utils/functions.js";


/** @param {NS} ns */
export async function main(ns) {
  while (ns.getHackingLevel() < 10) { await ns.sleep(100); }
  ns.tprint('hacking joesguns');
  await wait_for_script(ns, 'scan-root.js');
  ns.run('attack.js', 1, 'joesguns');
  while (ns.getHackingLevel() < 50) { await ns.sleep(100); }
  ns.ui.openTail();
  ns.print(`
Train dex & agi to 50
Rob store until \$1.2m
Travel to Ishima, join Tian Di Hui (\$1m, hack 50)
Upgrade home server (16gb)
Buy tor router & brutessh
Join CSEC (scan-root and backdoor CSEC)
Hack for CSEC until 3.75k rep
Hack for Tian Di Hui until 6.25k rep
Rob store until \$40m
Join Sector-12 & Aevum (\$40m)
Join Nitesec (hack 220, 2 ports) - if possible
Buy & install augmentations: (\$456m)
    * Tian Di Hui S.N.A 6.25k rep \$30m
    * Tian Di Hui ADR-V1 3.750 rep \$17.5m
    * CSEC BitWire 3.75k rep \$10m
    * CSEC Synaptic Enhancement Implant 2k rep \$7.5m
    * CSEC Neurotrainer I 1k rep \$4m
Upgrade home server memory & NeuroFlux Governor as much as possible
`);

}