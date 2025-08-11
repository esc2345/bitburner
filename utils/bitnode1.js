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

Reset 1:
Join Tian Di Hui (\$1m, hack 50)
Join CSEC (hack 60, 1 port)
Join Sector-12 and Aevum (\$40m)
Join Nitesec (hack 220, 2 ports)
Hack for Sector-12 until 12.5k rep
Hack for Nitesec until 15k rep
Buy & install augmentations: (\$4.3b)
    * Nitesec Embedded Netburner Module \$250m
    * Sector-12 CashRoot Starter Kit \$125m
    * Nitesec Artificial Synaptic Potentiation \$80
    * Sector-12 Speech Processor Implant \$50
    * Nitesec Neurotrainer II \$45
    * Sector-12 Augmented Targeting I \$15
    * Sector-12 Augmented Targeting II \$42.5
    * Sector-12 Wired Reflexes \$2.5

Reset 2:
Join CSEC (hack 60, 1 port)
Join Nitesec (hack 220, 2 ports)
Join Ishima, New Tokyo, Chongqing (\$30m, \$20m, \$20m)
Hack for Tian Di Hui until 75k rep
Hack Nitesec until 45k rep
Buy & install augmentations: (\$1.4b)
    * Tian Di Hui Neuroreceptor Management Implant 75k rep \$550m
    * Nitesec Neural-Retention Enhancement \$250m
    * CSEC Cranial Signal Processors - Gen I 10k rep \$70m
    * Nitesec Cranial Signal Processors - Gen II 18.75k rep \$125m
    * Tian Di Hui Nanofiber Weave 37.5k rep \$125m
    * Tian Di Hui Nuoptimal Nootropic Injector Implant 5k rep \$20m
    * Tian Di Hui Speech Enhancement 2.5k rep \$12.5m

`);

}