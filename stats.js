import { list_servers } from "/utils/functions.js";

/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['sort', ['time', 'difficulty', 'maxmoney']], ['s', ['time', 'difficulty', 'maxmoney']] ]);
  const servers = list_servers(ns).filter(n => {
    return ns.hasRootAccess(n) && n.indexOf('home') != 0;
  });

  let dataTable = [];
  for (let sName of servers) {
    const { hostname, minDifficulty, hackDifficulty,
      moneyMax, moneyAvailable, maxRam } = ns.getServer(sName);
    if (isNaN(moneyMax) || moneyMax == 0) continue;
    let secs = ns.getWeakenTime(sName) / 1000;
    dataTable.push([
      hostname,
      secs,
      moneyAvailable,
      moneyMax,
      hackDifficulty,
      minDifficulty,
      maxRam
    ]);
  }

  let temp = '';
  if (args.sort.length == 1) temp = args.sort[0];
  if (args.s.length == 1) temp = args.s[0];
  switch (temp) {
    case 'time':
      dataTable.sort((a, b) => b[1] - a[1]);
      break;
    case 'difficulty':
      dataTable.sort((a, b) => (b[4] - b[5]) - (a[4] - a[5]));
      break;
    case 'maxmoney':
      dataTable.sort((a, b) => b[3] - a[3]);
      break;
    default: // max money / time
      dataTable.sort((a, b) => b[3] / b[1] - a[3] / a[1]);
  }


  for (let row of dataTable) {
    const [hostname, secs, moneyAvailable, moneyMax, hackDifficulty, minDifficulty, maxRam] = row;
    ns.tprint(` ${hostname.padEnd(19)}:` +
      ` ${(moneyAvailable / moneyMax * 100).toFixed(1).padStart(5)}%\$` +
      ` ${(hackDifficulty - minDifficulty).toFixed(3).padStart(7)},` +
      ` ${(Math.floor(secs / 60)).toFixed(0).padStart(2)}m ${(secs % 60).toFixed(0).padStart(2)}s,` +
      ` \$${ns.formatNumber(moneyMax).padStart(8)},` +
      ` \$${ns.formatNumber(moneyMax / secs).padStart(8)},` +
      ` ${maxRam}GB` +
      ` security ${Math.round(hackDifficulty)}/${minDifficulty}`);
  }

  //ns.tprint(args);
}