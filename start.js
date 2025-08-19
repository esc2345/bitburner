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
  ns.tprint(`current bitnode = ${currentNode}`);
  
  switch (currentNode) {
    case 1:
      if (ns.getServerMaxRam('home') < 16) {
        ns.tprint(`
* * * 
Home server RAM < 16
1. Train dex & agi to 20
2. Shoplift until \$1.01m
3. Upgrade home computer RAM
4. soft reset
* * *`);
        return
      } else {
        ns.run('/utils/bitnode1.js');
      }
  }
}
