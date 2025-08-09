import { list_servers, estimate_grow_cycles, estimate_hack_percent } from "/utils/functions.js";

var WEAKEN_EFFECT = 0.05, GROW_EFFECT = 2 * 0.002, HACK_EFFECT = 0.002;

// grow slack time = 0.2 * weaken
// hack slack time = 0.75 * weaken

/** @param {NS} ns */
export async function main(ns) {
  const servers = list_servers(ns);
  const targetName = 'joesguns';
  const target = ns.getServer(targetName);
  ns.tprint(targetName);
  //await ns.hack(targetName);
  //const player = ns.getPlayer();
  const hackPct = estimate_hack_percent(ns, target);
  //ns.tprint(`${hackPct == ns.hackAnalyze(targetName)}`);
  //ns.tprint(`${hackPct == ns.formulas.hacking.hackPercent(target, player)}`);

  for (let i = 0.05; i < 1; i += 0.05) {
    let h = Math.floor((1 - i) / hackPct);
    let g = estimate_grow_cycles(ns, target, 1 / i, 1);
    let w = Math.ceil((g * GROW_EFFECT + HACK_EFFECT) / WEAKEN_EFFECT);
    //target.moneyAvailable = target.moneyMax * i;
    //let gt2 = ns.formulas.hacking.growThreads(target, player, target.moneyMax);
    let mem = 1.75 * (g + w) + 1.7 * h;
    ns.tprint(`${i.toFixed(2)}` +
      ` ${h.toString().padStart(3)}`+
      ` ${Math.ceil(g).toString().padStart(4)}`+
      ` ${w.toString().padStart(3)}`+
      ` ${ns.formatRam(mem).padStart(8)}` + 
      ` ${(h * hackPct).toFixed(6)}`);
  }


}