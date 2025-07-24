/*

If browser hangs, load with ?noscripts:
  e.g. https://bitburner-official.github.io/?noscripts

alias buyall="buy BruteSSH.exe;buy FTPCrack.exe;buy relaySMTP.exe;buy HTTPWorm.exe;buy SQLInject.exe"
alias stats="run stats.js"

*/

/** @param {NS} ns */
export async function main(ns) {
  const startupScripts = [
    'scan-root.js',
    '/utils/1.js'
  ];
  for (let ss of startupScripts) {
    ns.tprint(`startup script: ${ss}`);
    let pid = ns.run(ss);
    while (ns.isRunning(pid)) {
      await ns.sleep(100);
    }
  }

  ns.tprint(`
* * * Learn algorithms at rothman university until hack level 10
* * * scan-root and loop joesguns
* * * Train combat skills until level 40
* * * Mug until \$200k and buy tor router
* * * Mug until \$500k and buy brutessh
* * * Mug until \$1.010m and upgrade home server
* * * Learn algorithms until hack 60
* * * scan-root and backdoor CSEC
* * * Hack for CSEC until 18.750k rep
* * * Hack for Tian Di Hui until 6.250k rep
* * * Buy Tian Di Hui augmentations: S.N.A, ADR-V1
* * * Buy all CSEC augmentations
* * * buy -a
* * * scan-root and backdoor avmnite-04h
  `);

}
