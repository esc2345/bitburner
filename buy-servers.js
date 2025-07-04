import {list_servers, copy_files} from "/utils/functions.js";

function getSpendingMoney(ns) {
  return ns.getServerMoneyAvailable('home') / 5;
}
/** @param {NS} ns */

export async function main(ns) {
  let serverNames = [];
  let ram = 32;
  let maxNum = ns.getPurchasedServerLimit();
  for (let i=0; i < maxNum; i++) {
    while (getSpendingMoney(ns) < ns.getPurchasedServerCost(ram)) {
      await ns.sleep(5000);
    }
    let name = ns.purchaseServer('home', ram);
    if (name != "") {
      copy_files(ns, name);
      serverNames.push(name);
      ns.exec('/scripts/share.js', name, Math.floor(ram / 4));
    }
  }

  if (length.serverNames == 0)
  serverNames = list_servers(ns).filter(s => s.indexOf('home-') == 0);
  let cost;
  do {
    ram *= 2;
    for (let name of serverNames) {
      cost = ns.getPurchasedServerUpgradeCost(name, ram);
      while (getSpendingMoney(ns) < cost) {
        await ns.sleep(5000);
      }
      ns.upgradePurchasedServer(name, ram);
    }
    await ns.sleep(500);
  } while (cost < Infinity);
}