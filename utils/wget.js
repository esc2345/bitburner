/** @param {NS} ns */
export async function main(ns) {
  const githubBase = 'https://raw.githubusercontent.com/esc2345/bitburner/refs/heads/main/';
  const files = [
    'buy-servers.js',
    'connect.js',
    'prep.js',
    'scan-root.js',
    'scripts/grow.js',
    'scripts/hack.js',
    'scripts/share.js',
    'scripts/weaken.js',
    'share-all.js',
    'start.js',
    'stats.js',
    'utils/1.js',
    'utils/1a.js',
    'utils/functions.js',
    'utils/generate-wget.js',
    'utils/wget.js',
    'z-servers.js'
  ]
  for (let f of files) {
    let url = githubBase + f;
    await ns.wget(url, f);
  }
}