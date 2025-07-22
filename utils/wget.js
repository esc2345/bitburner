
/** @param {NS} ns */
// usage: wget "" utils/wget.js;run utils/wget.js
export async function main(ns) {
	const githubBase = 'https://raw.githubusercontent.com/esc2345/bitburner/refs/heads/main/';
  const files = [
    'buy-servers.js',
    'connect.js',
    'loop.js',
    'prep.js',
    'scan-root.js',
    'share-all.js',
    'start.js',
    'stats.js',
    'scripts/grow.js',
    'scripts/hack.js',
    'scripts/share.js',
    'scripts/weaken.js',
    'utils/1.js',
    'utils/1a.js',
    'utils/functions.js'
  ]
  for (let f of files) {
    let url = githubBase + f;
    await ns.wget(url, f);
  }
}