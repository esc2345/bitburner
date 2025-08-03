/*

If browser hangs, load with ?noscripts:
  e.g. https://bitburner-official.github.io/?noscripts

alias buyall="buy BruteSSH.exe;buy FTPCrack.exe;buy relaySMTP.exe;buy HTTPWorm.exe;buy SQLInject.exe"
alias stats="run stats.js"

*/

/** @param {NS} ns */
export async function main(ns) {
  const startupScripts = [
    '/utils/1.js',
    'scan-root.js'
  ];
  for (let ss of startupScripts) {
    ns.tprint(`startup script: ${ss}`);
    let pid = ns.run(ss);
    while (ns.isRunning(pid)) {
      await ns.sleep(100);
    }
  }
  while (ns.getHackingLevel() < 10){
    await ns.sleep(100);
  }
  ns.run('attack.js', 1, 'joesguns');
  
}
