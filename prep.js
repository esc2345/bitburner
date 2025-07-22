/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['h', false]]);
  let t = ns.getServer(args._[0]);
  if (t.hostname == 'home' || t.moneyMax == 0) {
    ns.tprint('invalid target');
    return;
  }

  do {
    const time = ns.getWeakenTime(t.hostname) + 500;
    t = ns.getServer(t.hostname);
    ns.tprint(`${t.hostname.padEnd(19)}` +
      ` ${(100 * t.moneyAvailable / t.moneyMax).toFixed(6).padStart(9)}%` +
      ` ${(t.hackDifficulty - t.minDifficulty).toFixed(3).padStart(7)}`);
    if (t.hackDifficulty > t.minDifficulty) {
      let threads = Math.min(
        Math.ceil((t.hackDifficulty - t.minDifficulty) / 0.05),
        Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / 1.75)
      );
      ns.run('scripts/weaken.js', threads, t.hostname);
    } else if (t.moneyAvailable < t.moneyMax) {
      let threads = Math.min(12,
        Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / 1.75)
      );
      ns.run('scripts/grow.js', threads, t.hostname, 0);
      ns.run('scripts/weaken.js', 1, t.hostname);
    } else {
      return;
    }
    await ns.sleep(time);
  } while (true);
}


/**
 * @param {AutocompleteData} data - context about the game, useful when autocompleting
 * @param {string[]} args - current arguments, not including "run script.js"
 * @returns {string[]} - the array of possible autocomplete options
 */
export function autocomplete(data, args) {
  // Example: Suggest server names based on user input
  if (args.length === 1) {
    return data.servers; // Suggest all server names
  } else if (args.length === 2 && args[0] === "--target") {
    return data.servers; // Suggest server names for the --target flag
  }
  return []; // No suggestions if no relevant input
}
