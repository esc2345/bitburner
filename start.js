import { wait_for_script } from "/utils/functions.js";
import { PORTS } from "/utils/constants.js";

/** @param {NS} ns */
export async function main(ns) {

  const scripts = [
    '/utils/setup.js',
    'scan-root.js'
  ];
  for (const s of scripts) {
    ns.tprint(`running ${s}`);
    await wait_for_script(ns, s);
  }
  const currentNode = ns.peek(PORTS.currentNode);

  switch (currentNode) {
    case 1:
      if (ns.getServerMaxRam('home') < 16) {
        ns.tprint(' * * * Train dex & agi to 50, shoplift, and upgrade home computer RAM');
        return
      } else {
        ns.run('/utils/bitnode1.js');
      }
  }
}
