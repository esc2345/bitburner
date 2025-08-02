import { FNAMES } from "/utils/constants.js";

function scan(ns, parent, server, list) {
  const children = ns.scan(server);
  for (let c of children) {
    if (parent != c) {
      list.push(c);
      scan(ns, server, c, list);
    }
  }
}

export function list_servers(ns) {
  let list = [];
  scan(ns, '', 'home', list);
  list.push('home');
  return list;
}


export function copy_files(ns, dest) {
  let files = ns.ls('home', 'scripts/');
  files.push('connect.js');
  ns.scp(files, dest, 'home');
}


/*
https://github.com/bitburner-official/bitburner-src/blob/dev/src/Hacking.ts
hack money % - calculatePercentMoneyHacked(server, person);
calculateHackingTime, calculateGrowTime, calculateWeakenTime
  weakenTime = 4 * hackTime
  growthTime = 3.2 * hackTime

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Server/formulas/grow.ts
grow % - calculateServerGrowth(server, threads, person, cores);
grow amount - calculateGrowMoney(server, threads, person, cores);

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Server/ServerHelpers.ts
getWeakenEffect
  weaken lower security level by 0.05 * threads * (1 + (cores - 1) / 16) * currentNodeMults.ServerWeakenRate
  grow raise security level by 2 * 0.002 * threads

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Netscript/NetscriptHelpers.tsx
  hack raise security level by 0.002 * threads
*/

export function estimate_grow_cycles(ns, target, ratio, threads, cores = 1) {
  const MULTS = JSON.parse(ns.read(FNAMES.bitnode));
  const adjGrowthLog = Math.min(
    Math.log1p(0.03 / target.minDifficulty),
    0.00349388925425578
  );
  const adjServerGrowth = (target.serverGrowth / 100) * MULTS.ServerGrowthRate;
  const playerHackMults = ns.getHackingMultipliers();
  const coreBonus = 1 + (cores - 1) / 16;
  const serverGrowthLog =
    adjGrowthLog * adjServerGrowth * playerHackMults.growth * coreBonus * threads;
  const logServerGrowthRate = Math.log(Math.max(Math.exp(serverGrowthLog), 1));
  return 1 + Math.ceil(Math.log(ratio) / logServerGrowthRate);
}

export function estimate_hack_percent(ns, server) {
  // expressed in decimal form 1.00 = 100%
  const MULTS = JSON.parse(ns.read(FNAMES.bitnode));
  const playerHackMults = ns.getHackingMultipliers();
  const difficultyMult = (100 - server.hackDifficulty) / 100;
  const playerHackLevel = ns.getHackingLevel();
  const skillMult = (playerHackLevel - (server.requiredHackingSkill - 1)) / playerHackLevel;
  const percentMoneyHacked =
    (difficultyMult * skillMult * playerHackMults.money * MULTS.ScriptHackMoney) / 240;
  return Math.min(1, Math.max(percentMoneyHacked, 0));
}

