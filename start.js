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
    ns.tprint(`startup script ${ss}`);
    let pid = ns.run(ss);
    while (ns.isRunning(pid)) {
      await ns.sleep(100);
    }
  }

  ns.tprint(`
* * * Learn CS at rothman university until hack level 10
* * * Root joesguns and prep joesguns
* * * Train combat skills until level 40
* * * Mug until join CSEC
* * * Hack for CSEC until 3.750k rep
* * * Upgrade home server to 8GB when possible
  `);

}
