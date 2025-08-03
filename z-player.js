/** @param {NS} ns */
export async function main(ns) {
const p = ns.getPlayer();
ns.tprint(p);
const pHackMults = ns.getHackingMultipliers();
ns.tprint(`${pHackMults.growth} ${pHackMults.growth == p.mults.hacking_grow}`);
const pHackLevel = ns.getHackingLevel();
ns.tprint(`${pHackLevel} ${pHackLevel == p.skills.hacking}`);
ns.tprint(`${pHackMults.money} ${pHackMults.money == p.mults.hacking_money}`)
}