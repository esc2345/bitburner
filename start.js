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
* * * Learn CS at rothman university until hack level 10. * * *
* * * Train combat skills until level 40.                 * * *
* * * Mug until join CSEC.                                * * *
* * * Hack for CSEC until 3.750k rep                      * * *
  `);


  const targets = [
    'sigma-cosmetics',
    'joesguns',
    'harakiri-sushi',
    /*
    'max-hardware',
    'phantasy',
    'the-hub',
    'rho-construction',
    'alpha-ent',
    '4sigma',
    'clarkinc',
    'b-and-a',
    'megacorp',
    'ecorp',
    'omnitek',
    'nwo',
    'kuai-gong',
    'blade'
    */
  ];
  for (const name of targets) {
    let done = false;
    while (!done) {
      if (ns.hasRootAccess(name) && ns.run('loop.js', 1, name)) {
        done = true;
      } else {
        /*
        const pid = ns.run('scan-root.js');
        while (ns.isRunning(pid)) {
          await ns.sleep(1000);
        }
        */
      }
      await ns.sleep(5000);
    }
  }
}
