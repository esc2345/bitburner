/*

If browser hangs, load with ?noscripts:
  e.g. https://bitburner-official.github.io/?noscripts

*/

async function waitForScript(ns, scriptName) {
  let pid = ns.run(scriptName);
  while (ns.isRunning(pid)) {
    await ns.sleep(100);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const startupScripts = [
    '/utils/1.js',
    'scan-root.js'
  ];
  for (let ss of startupScripts) {
    ns.tprint(`startup script: ${ss}`);
    await waitForScript(ss);
  }

  while (ns.getHackingLevel() < 10) { await ns.sleep(100); }
  await waitForScript(ns, 'scan-root.js');
  ns.run('attack.js', 1, 'joesguns');

  ns.run('buy-servers.js');

  while (ns.getWeakenTime('joesguns') > 60000) { await ns.sleep(100); }
  ns.run('attack.js', 1, 'phantasy');

}
