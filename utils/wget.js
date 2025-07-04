/** @param {NS} ns */

// usage: wget "" utils/wget.js;run utils/wget.js
export async function main(ns) {
	const githubBase = 'https://raw.githubusercontent.com/esc2345/bitburner/refs/heads/main/';
  const files = [
    'stats.js',
    'scan-root.js',
    'loop.js',
    'connect.js',
    'buy-servers.js',
    'scripts/grow.js',
    'scripts/hack.js',
    'scripts/weaken.js',
    'scripts/share.js',
    'utils/functions.js',
    'utils/startup.js',
    'utils/startup1.js'
  ]
  for (let f of files) {
    let uri = githubBase + f;
    ns.wget(uri, 'home', f);
  }
}