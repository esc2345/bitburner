import { wait_for_script } from "utils/functions.js";


/** @param {NS} ns */
export async function main(ns) {
  while (ns.getHackingLevel() < 10) { await ns.sleep(100); }
  ns.tprint('hacking joesguns');
  await wait_for_script(ns, 'scan-root.js');
  ns.run('attack.js', 1, 'joesguns');
}