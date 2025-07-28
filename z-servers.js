import { list_servers } from "utils/functions.js";


function estimateGrow(ns, target, person, ratio, threads, cores = 1) {
  const MULTS = JSON.parse(ns.read('/temp/bitnode.txt'));
  const adjGrowthLog = Math.min(
    Math.log1p(0.03 / target.minDifficulty),
    0.00349388925425578
  );
  const adjServerGrowth = (target.serverGrowth / 100) * MULTS.ServerGrowthRate;
  const coreBonus = 1 + (cores - 1) / 16;
  const serverGrowthLog =
    adjGrowthLog * adjServerGrowth * person.mults.hacking_grow * coreBonus * threads;
  const logServerGrowthRate = Math.log(Math.max(Math.exp(serverGrowthLog), 1));
  return 1 + Math.ceil(Math.log(ratio) / logServerGrowthRate);
}

function estimateHackPct(ns, server, person) {
  // expressed in decimal form 1.00 = 100%
  const MULTS = JSON.parse(ns.read('/temp/bitnode.txt'));
  const difficultyMult = (100 - server.minDifficulty) / 100;
  const skillMult = (person.skills.hacking - (server.requiredHackingSkill - 1)) / person.skills.hacking;
  const percentMoneyHacked =
    (difficultyMult * skillMult * person.mults.hacking_money * MULTS.ScriptHackMoney) / 240;
  return Math.min(1, Math.max(percentMoneyHacked, 0));
}

function estimateWeakenTime(ns, server, person) {
  const MULTS = JSON.parse(ns.read('/temp/bitnode.txt'));
  const { minDifficulty, requiredHackingSkill } = server;
  const difficultyMult = requiredHackingSkill * minDifficulty;

  const baseDiff = 500;
  const baseSkill = 50;
  const diffFactor = 2.5;
  let skillFactor = diffFactor * difficultyMult + baseDiff;
  skillFactor /= person.skills.hacking + baseSkill;

  const hackTimeMultiplier = 5;
  const hackingTime =
    (hackTimeMultiplier * skillFactor) /
    (person.mults.hacking_speed * MULTS.HackingSpeedMultiplier);
  return 4 * hackingTime;
}

/** @param {NS} ns */
export async function main(ns) {
  const servers = list_servers(ns).filter(name => ns.getServer(name).moneyMax > 0 && name != 'home');
  const data = [];
  for (let name of servers) {
    const s = ns.getServer(name);

    let person = ns.getPlayer();
    person.skills.hacking = 1300;
    const bucket = Math.ceil((s.requiredHackingSkill + 1) / 50);
    person.skills.hacking = 50 * bucket;
    let mem = 64 * bucket;
    const time = estimateWeakenTime(ns, s, person);


    let maxConcurrentThreads = (mem / 1.75);
    let weakenThreads = (s.baseDifficulty - s.minDifficulty) / 0.05;
    const weakenCycles = Math.ceil(weakenThreads / maxConcurrentThreads);

    let growThreads = estimateGrow(ns, s, person, s.moneyMax / s.moneyAvailable, 1);
    weakenThreads = Math.ceil(growThreads / 12);
    const growCycles = Math.ceil((growThreads + weakenThreads) / maxConcurrentThreads);

    let hackPct = estimateHackPct(ns, s, person);
    growThreads = estimateGrow(ns, s, person, 1 / (1 - hackPct), 1);
    weakenThreads = Math.ceil(growThreads / 12);
    const hackCycles = Math.ceil((1 + growThreads + weakenThreads) / maxConcurrentThreads);

    const t1 = time * (weakenCycles + growCycles + hackCycles);
    const money = s.moneyMax * hackPct;
    const eps = money / t1;

    data.push({
      'name': name,
      'moneyMax': s.moneyMax,
      'moneyPct': s.moneyAvailable / s.moneyMax * 100,
      'reqHack': s.requiredHackingSkill,
      'baseHack': s.baseDifficulty,
      'currentHack': s.hackDifficulty,
      'minHack': s.minDifficulty,
      'weaken': weakenCycles,
      'grow': growCycles,
      'hack': hackCycles,
      'time': t1,
      'hackMoney': money,
      'eps': eps
    });

  }
  data.sort((a, b) => a.reqHack - b.reqHack);

  for (let row of data) {
    const hrs = Math.floor(row.time / 3600)
    const mins = Math.floor((row.time % 3600) / 60);
    const secs = Math.floor(row.time % 60);
    ns.tprint(`${row.name.padEnd(19)}` +
      //` \$${ns.formatNumber(row.moneyMax).padStart(8)}` +
      ` ${row.moneyPct.toFixed(1).padStart(5)}%` +
      ` ${hrs.toString().padStart(4)}h ${mins.toString().padStart(2)}m ${secs.toString().padStart(2)}s` +
      ` ${row.reqHack.toString().padStart(5)}` +
      //` ${row.baseHack.toString().padStart(2)}` +
      //` ${row.currentHack.toFixed(3).padStart(6)}` +
      //` ${row.minHack.toString().padStart(2)}` +
      ` ${row.eps.toFixed(2).padStart(8)}` +
      ` \$${ns.formatNumber(row.hackMoney).padStart(8)}`);
  }
}