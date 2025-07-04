/** @param {NS} ns */
export async function main(ns) {
  const startupScripts = [
    '/utils/startup.js',
    'scan-root.js'
  ];
  for(let ss of startupScripts){
    ns.tprint(`startup script ${ss}`);
    let pid = ns.run(ss);
    while (ns.isRunning(pid)){
      await ns.sleep(100);
    }
  }

  let endTime = Date.now() + (1000 * 60 * 2);
  while (Date.now() < endTime) {
    const ram = ns.getServerMaxRam('home') - 3;
    const t = Math.floor(ram / 1.75);
    let pid = ns.run('/scripts/hack.js', t, 'foodnstuff', 0);
    ns.tprint('hacking foodnstuff');
    while (ns.isRunning(pid)) {
      await ns.sleep(100);
    }
    await ns.sleep(100);
  }
  ns.tprint('run scan-root.js;\nrun loop.js joesguns');
}
/*

If browser hangs, load with ?noscripts:
  e.g. https://bitburner-official.github.io/?noscripts

alias buyall="buy BruteSSH.exe;buy FTPCrack.exe;buy relaySMTP.exe;buy HTTPWorm.exe;buy SQLInject.exe"
alias stats="run stats.js"

*/