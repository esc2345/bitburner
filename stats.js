import { list_servers } from "/utils/functions.js";

/** @param {NS} ns */
export async function main(ns) {
  const servers = list_servers(ns).filter(n => {
    return ns.hasRootAccess(n) && n.indexOf('home') != 0;
  });

  let dataTable = [];
  for (let sName of servers) {
    const { hostname, minDifficulty, hackDifficulty,
      moneyMax, moneyAvailable } = ns.getServer(sName);
    let moneyPct = 100 * moneyAvailable / moneyMax;
    if (isNaN(moneyPct)) continue;
    let secs = ns.getWeakenTime(sName) / 1000;
    dataTable.push([
      hostname,
      moneyPct,
      secs,
      moneyMax,
      hackDifficulty,
      minDifficulty
    ]);
  }

  dataTable.sort((a, b) => b[2] - a[2]);

  for (let row of dataTable) {
    const [hostname, moneyPct, secs, moneyMax, hackDifficulty, minDifficulty] = row;
    ns.tprint(` ${hostname.padEnd(19)}:` +
      ` \$${moneyPct.toFixed(1).padStart(5)}%` +
      ` ${(hackDifficulty - minDifficulty).toFixed(3).padStart(7)},` +
      ` ${(Math.floor(secs / 60)).toFixed(0).padStart(2)}m ${(secs % 60).toFixed(0).padStart(2)}s,` +
      ` \$${ns.formatNumber(moneyMax).padStart(8)},` +
      ` security ${Math.round(hackDifficulty)}/${minDifficulty}`);
  }
}