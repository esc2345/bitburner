import { copy_files, list_servers } from "/utils/functions.js";

function getSpendingMoney(ns) {
  return ns.getServerMoneyAvailable('home') / 10;
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('getServerMoneyAvailable');
  ns.disableLog('getPurchasedServerCost');
  ns.disableLog('getPurchasedServerUpgradeCost');
  ns.disableLog('sleep');
  ns.disableLog('exec');
  ns.disableLog('kill');

  let ram = 64;
  let maxNum = ns.getPurchasedServerLimit();
  for (let i = 0; i < maxNum; i++) {
    while (getSpendingMoney(ns) < ns.getPurchasedServerCost(ram)) {
      await ns.sleep(5000);
    }
    let name = ns.purchaseServer('home', ram);
    if (name != "") {
      copy_files(ns, name);
    }
  }

  const serverNames = list_servers(ns).filter(s => s.indexOf('home-') == 0);
  let upgradedCount = 1;
  while (upgradedCount > 0) { // stop if no servers are upgraded
    upgradedCount = 0;
    for (let name of serverNames) {
      ram = ns.getServerMaxRam(name) * 2;
      const cost = ns.getPurchasedServerUpgradeCost(name, ram);
      //ns.tprint(`${name} ${ns.formatNumber(ram)} \$${ns.formatNumber(cost)}`);
      if (cost > 0 && isFinite(cost)) {
        while (getSpendingMoney(ns) < cost) {
          await ns.sleep(5000);
        }
        ns.upgradePurchasedServer(name, ram);
        upgradedCount++;
      }
    }
    await ns.sleep(500);
  }
}