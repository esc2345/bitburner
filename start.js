/*

If browser hangs, load with ?noscripts:
  e.g. https://bitburner-official.github.io/?noscripts

*/

import { wait_for_script } from "utils/functions.js";

/** @param {NS} ns */
export async function main(ns) {
  const startupScripts = [
    'scan-root.js',
    '/utils/1.js',
  ];

  for (let ss of startupScripts) {
    ns.tprint(`startup script: ${ss}`);
    await wait_for_script(ns, ss);
  }

  ns.run('utils/joesguns.js');

  if (ns.getServerMaxRam('home') < 16) {
    ns.tprint('* * * upgrade home server to 16 GB * * *');
    return;
  }

  ns.run('buy-servers.js');

  //ns.run('utils/phantasy.js');
}
