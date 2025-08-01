/** @param {NS} ns */
export async function main(ns) {
  const githubBase = 'https://raw.githubusercontent.com/esc2345/bitburner/refs/heads/main/';
  const files = [
    'buy-servers.js',
    'connect.js',
    'execute.js',
    'prep.js',
    'scan-root.js',
    'schedule.js',
    'scripts/grow.js',
    'scripts/hack.js',
    'scripts/share.js',
    'scripts/weaken.js',
    'share-all.js',
    'start.js',
    'stats.js',
    'temp/bitnode.json',
    'temp/rooted.json',
    'temp/workers.json',
    'utils/1.js',
    'utils/1a.js',
    'utils/batch.js',
    'utils/filenames.js',
    'utils/functions.js',
    'utils/generate-wget.js',
    'utils/portnumbers.js',
    'utils/wget.js',
    'z-player.js',
    'z-ports.js',
    'z-servers.js'
  ]
  for (let f of files) {
    let url = githubBase + f;
    await ns.wget(url, f);
  }
}