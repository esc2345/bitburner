import { estimate_grow_cycles, estimate_hack_percent } from "/utils/functions.js";
import { Batch } from "/utils/batch.js";
import FILENAME from "/utils/filenames.js";

const WEAKEN_EFFECT = 0.05, GROW_EFFECT = 2 * 0.002, HACK_EFFECT = 0.002;

function showHelpText(ns){
    ns.tprint(`
Writes to ${FILENAME.scheduledBatches} a batch of tasks for running against a target server.
usage: ${ns.getScriptName()} weaken|grow|hack target_server_name
  weaken - weakens a target to minimum security level
  grow - weakens a target to minimum security level and grows to max \$
  hack - weakens, grows, then loops hack, grow, and weaken`);
}

/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['h', false]]);
  if (args.h || args._.length != 2 || Batch.isValidOption(args._[0]) == false) {
    showHelpText(ns);
    return;
  }
  const t = ns.getServer(args._[1]);
  if (args._[1].indexOf('home') == 0 || t.moneyMax == 'undefined' || t.moneyMax == 0) {
    throw `Invalid target: ${args._[1]}`;
  }
  let data = [];
  switch (args._[0]) {
    case 'hack':
      const hackPct = estimate_hack_percent(ns, t);
      const gThreads = estimate_grow_cycles(ns, t, 1 / (1 - hackPct), 1);
      const wThreads = Math.ceil((gThreads * GROW_EFFECT + HACK_EFFECT) / WEAKEN_EFFECT);
      let b = new Batch('hack', args._[1]);
      b.addTask('hack', 1);
      b.addTask('grow', gThreads);
      b.addTask('weaken', wThreads);
      data.push(b);
    case 'grow':
      if (t.moneyAvailable < t.moneyMax) {
        const threads = Math.floor(WEAKEN_EFFECT / GROW_EFFECT);
        const cycles = estimate_grow_cycles(ns, t, t.moneyMax / t.moneyAvailable, threads);
        //ns.tprint(`grow cycles: ${cycles} ${estimate_grow_cycles(ns, t, 1)}`);
        //ns.tprint(ns.growthAnalyze(t.hostname, t.moneyMax/t.moneyAvailable));
        let b = new Batch('grow', args._[1]);
        for (let i = 0; i < cycles; i++) {
          b.addTask('grow', threads);
          b.addTask('weaken', 1);
        }
        data.push(b);
      }
    case 'weaken':
      if (t.hackDifficulty > t.minDifficulty) {
        let b = new Batch('weaken', args._[1]);
        b.addTask('weaken', Math.ceil((t.hackDifficulty - t.minDifficulty) / WEAKEN_EFFECT));
        data.push(b);
      }
  }
  //ns.tprint(data);
  while (ns.fileExists(FILENAME.scheduledBatches)) {
    await ns.sleep(1000);
  }
  ns.write(FILENAME.scheduledBatches, JSON.stringify(data));
  for (const b of data){
    ns.tprint(`${b.target} ${b.batchType}: ${b.tasks.length} tasks`);
  }
}


/**
 * @param {AutocompleteData} data - context about the game, useful when autocompleting
 * @param {string[]} args - current arguments, not including "run script.js"
 * @returns {string[]} - the array of possible autocomplete options
 */
export function autocomplete(data, args) {
  const options = ['weaken', 'grow', 'hack'];
  if (args.length <= 1 && !options.includes(args[0])) {
    return options;
  }
  if (args.length == 2) {
    return data.servers.concat(['all']); // Suggest all server names
  }
  return [];
}
