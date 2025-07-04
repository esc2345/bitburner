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
  let list = ['home'];
  scan(ns, '', 'home', list);
  return list;
}

export function copy_files(ns, dest) {
  let files = ns.ls('home', 'scripts/');
  files.push('connect.js');
  files.push('bitnode.txt');
  files.push('loop.js');
  files.push('utils.js');
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
export function calculateEps(ns, server) {
  if (server.maxMoney == 0) return [0.0, 0.0];
  const mults = JSON.parse(ns.read('bitnode.txt'));
  const player = ns.getPlayer();
  // money gained with 1 hack thread
  const { cpuCores, hackDifficulty, hostname, minDifficulty, moneyAvailable,
    moneyMax, requiredHackingSkill, serverGrowth } = server;
  const difficultyMult = (100 - minDifficulty) / 100;
  const skillMult = (player.skills.hacking - (requiredHackingSkill - 1))
    / player.skills.hacking;
  const hackGrowth = (difficultyMult * skillMult *
    player.mults.hacking_money * mults.ScriptHackMoney) / 240;
  const hackMoney = moneyAvailable * Math.min(1, hackGrowth);
  if (hackMoney <= 0) return [0.0, 0.0];

  const hackMoneyMax = moneyMax * Math.min(1, hackGrowth);

  const weakenEffect = 0.05;
  const growEffect = 2 * 0.002;
  const coreBonus = 1 + (cpuCores - 1) / 16;
  const weakenDelta = weakenEffect * coreBonus * mults.ServerWeakenRate;
  const weaken1Cycles = Math.ceil((hackDifficulty - minDifficulty) / weakenDelta); // weaken to min security level
  const growThreads = Math.floor(weakenDelta / growEffect); // weaken : grow
  // number of grow cycles
  const adjGrowLog = Math.min(Math.log1p(0.03 / minDifficulty), 0.00349388925425578);
  const adjSGrow = (serverGrowth / 100) * mults.ServerGrowthRate;
  const sGrowLog = adjGrowLog * adjSGrow * player.mults.hacking_grow * coreBonus * growThreads;
  const sGrowRate = Math.max(Math.exp(sGrowLog), 1);
  let growCycles = Math.ceil(Math.log(moneyMax / moneyAvailable) / Math.log(sGrowRate));

  const weaken2Cycles = Math.ceil(growCycles * growEffect * growThreads / weakenDelta); //weaken to offset grow

  // grow and hack are padded to match the time of weaken
  const time = (weaken1Cycles + weaken2Cycles + growCycles + 3) * ns.getWeakenTime(hostname);

  return [hackMoney / time, hackMoneyMax / 100000];
}
