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
}
