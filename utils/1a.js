/** @param {NS} ns */
export async function main(ns) {
  ns.tprint('.');
  try {
    mults = ns.getBitNodeMultipliers();
    ns.write('/temp/bitnode.txt', JSON.stringify(mults), 'w');
  } catch (e) { }
}