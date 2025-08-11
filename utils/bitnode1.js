import { wait_for_script } from "utils/functions.js";


/** @param {NS} ns */
export async function main(ns) {
  const sourceFiles = new Map(JSON.parse(ns.read(FNAMES.sourceFiles)));
  const augments = new Map(JSON.parse(ns.read(FNAMES.augments)));
  let resetCounter = 0;
  if(augments.has('Social Negotiation Assistant (S.N.A)')){
    resetCounter = 1;
  }
  if(augments.has('CashRoot Starter Kit')){
    resetCounter = 2;
  }

  while (ns.getHackingLevel() < 10) { await ns.sleep(100); }
  ns.tprint('hacking joesguns');
  await wait_for_script(ns, 'scan-root.js');
  ns.run('attack.js', 1, 'joesguns');
  while (ns.getHackingLevel() < 50) { await ns.sleep(100); }
  ns.tprint(' * * * Train dex & agi to 50');


}