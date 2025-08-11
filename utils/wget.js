/** @param {NS} ns */
export async function main(ns) {
  const githubBase = 'https://raw.githubusercontent.com/esc2345/bitburner/refs/heads/main/';
  const files = [
    attack.js,
    buy-servers.js,
    connect.js,
    contracts.js,
    generate-wget.js,
    scan-root.js,
    scripts/grow.js,
    scripts/hack.js,
    scripts/share.js,
    scripts/weaken.js,
    start.js,
    stats.js,
    utils/bitnode1-8gb.js,
    utils/bitnode1.js,
    utils/constants.js,
    utils/functions.js,
    utils/real-bitnode-mults.js,
    utils/wget.js,
    z-formulas.js,
    z-player.js,
    z-ports.js,
    z-servers.js
  ]
  for (let f of files) {
    let url = githubBase + f;
    await ns.wget(url, f);
  }
}