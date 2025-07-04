import { list_servers } from "utils/functions.js";

const MEM_W = 1.75, MEM_H = 1.75, MEM_G = 1.8;
const WEAKEN_EFFECT = 0.05, GROW_EFFECT = 2 * 0.002, HACK_EFFECT = 0.002;
const SLEEP_TIME = 40;
var MULTS;

class Action {
  static validActions = ['weaken', 'hack', 'grow'];
  constructor(a, t) {
    this.action;
    this.threads;

    if (Action.validActions.includes(a) && Number.isFinite(t)) {
      this.action = a;
      this.threads = t;
    } else {
      throw new Error(`Invalid parameters: (${a}, ${t})`);
    }
  }
  getType() {
    return this.action;
  }
  setThreads(n) {
    this.threads = n;
    return this;
  }
  getExecInfo() {
    switch (this.action) {
      case 'weaken':
        return ['scripts/weaken.js', MEM_W, this.threads];
      case 'grow':
        return ['scripts/grow.js', MEM_G, this.threads];
      case 'hack':
        return ['scripts/hack.js', MEM_H, this.threads];
    }
  }
  static getActions(ns, target, skipWG = true) {
    let actions = [];
    let deltaSecurity = target.hackDifficulty - target.minDifficulty;
    let threads = Math.floor(deltaSecurity / WEAKEN_EFFECT);
    if (threads > 0 && !skipWG) {
      actions.push(new Action('weaken', threads));
    }
    if ((target.moneyAvailable / target.moneyMax) < 0.9 && !skipWG) {
      let g = Math.max(1, estimateGrowThreads(ns, target));
      let w = Math.max(1, Math.ceil(g * GROW_EFFECT / WEAKEN_EFFECT));
      actions.push(new Action('grow', g));
      actions.push(new Action('weaken', w));
    }
    if (actions.length == 0) {
      let h = 1;
      let g = Math.max(1,
        Math.floor((WEAKEN_EFFECT - (HACK_EFFECT * h)) / GROW_EFFECT)
      );
      let w = 1;
      actions.push(new Action('hack', h));
      actions.push(new Action('grow', g));
      actions.push(new Action('weaken', w));
    }
    return actions.reverse();
  }
}



function estimateGrowThreads(ns, target) {
  const adjGrowthLog = Math.min(
    Math.log1p(0.03 / target.minDifficulty),
    0.00349388925425578);
  const adjServerGrowth = (target.serverGrowth / 100) * MULTS.ServerGrowthRate;
  const player = ns.getPlayer();
  const coreBonus = 1 + (target.cpuCores - 1) / 16;
  const growThreads = Math.floor(WEAKEN_EFFECT / GROW_EFFECT); // weaken : grow
  const serverGrowthLog = adjGrowthLog * adjServerGrowth *
    player.mults.hacking_grow * coreBonus * growThreads;
  const logServerGrowthRate = Math.log(Math.max(Math.exp(serverGrowthLog), 1));
  const logMoneyRatio = Math.log(target.moneyMax / target.moneyAvailable)
  const growCycles = Math.ceil(logMoneyRatio / logServerGrowthRate);
  return Math.ceil(growThreads * growCycles);
}



/** @param {NS} ns **/
export async function main(ns) {
  MULTS = JSON.parse(ns.read('/temp/bitnode.txt'));
  const args = ns.flags([['h', false]]);
  const t = ns.getServer(args._[0]);
  if (t.hostname == 'home' || t.moneyMax == 0){
    ns.tprint('invalid target');
    return;
  }

  let actions = Action.getActions(ns, t, false);
  let servers = list_servers(ns).filter(
    s => ns.getServer(s).hasAdminRights);

  let getActionsCount = 1;
  let actionTime = Math.ceil(ns.getWeakenTime(t.hostname));
  let updateTime = Date.now() + actionTime;
  let lastServerPoolUpdate = Date.now();

  do {
    let action = actions.pop();
    let [script, mem, threads] = action.getExecInfo();
    for (const name of servers) {
      const s = ns.getServer(name);
      let serverMem = (s.maxRam - s.ramUsed);
      if (s.hostname == 'home')
        serverMem -= 8;
      let n = Math.floor(serverMem / mem);
      n = Math.min(n, threads);
      if (n > 0 && ns.exec(script, s.hostname, n, t.hostname, actionTime)) {
        threads -= n;
      }
      if (threads <= 0) {
        break;
      }
    }
    if (threads > 0) {
      actions.push(action.setThreads(threads));
    }
    if (actions.length <= 0) {
      for (let a of Action.getActions(ns, t, (getActionsCount++ % 20))) {
        actions.push(a);
      }
    }
    if (Date.now() > updateTime) {
      actionTime = Math.ceil(ns.getWeakenTime(t.hostname));
      updateTime = Date.now() + actionTime;
    }
    if (Date.now() - lastServerPoolUpdate > 300000) {
      servers = list_servers(ns).filter(s => ns.getServer(s).hasAdminRights);
    }
    await ns.sleep(SLEEP_TIME);
  } while (actions.length > 0);
}
/*

  s = ns.getServer(serverName);
  t = ns.getServer(targetName);
  const player = ns.getPlayer();

  const maxActions = Math.floor(ns.getWeakenTime(t.hostname) / SLEEP_TIME) - 1;
  const memPerAction = (s.maxRam - s.ramUsed) / maxActions;
  const w = Math.floor(memPerAction / MEM_W);

  const coreBonus = 1 + (s.cpuCores - 1) / 16;
  const weakenDelta = 0.05 * coreBonus * MULTS.ServerWeakenRate; // weaken effect
  const g = Math.floor(w * weakenDelta / .004); // grow effect

  const adjGrowLog = Math.min(Math.log1p(0.03 / minDifficulty), 0.00349388925425578);
  const adjSGrow = (t.serverGrowth / 100) * MULTS.ServerGrowthRate;
  const sGrowLog = adjGrowLog * adjSGrow * player.MULTS.hacking_grow * coreBonus * g;
  const sGrowRate = Math.max(Math.exp(sGrowLog), 1);

  const growMoney = t.moneyMax / sGrowRate;

  const difficultyMult = (100 - t.hackDifficulty) / 100;
  const skillMult = (player.skills.hacking - (t.requiredHackingSkill - 1))
    / player.skills.hacking;
  const hackRate = (difficultyMult * skillMult *
    player.MULTS.hacking_money * MULTS.ScriptHackMoney) / 240;
  const hackMoney = t.moneyMax * Math.min(1, hackRate);

  const h = Math.floor(growMoney / hackMoney);

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
