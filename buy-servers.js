import { copy_files, list_servers } from "/utils/functions.js";

function getSpendingMoney(ns) {
  return ns.getServerMoneyAvailable('home') / 5;
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('getServerMoneyAvailable');
  ns.disableLog('getPurchasedServerCost');
  ns.disableLog('getPurchasedServerUpgradeCost');
  ns.disableLog('sleep');
  ns.disableLog('exec');
  ns.disableLog('kill');

  let ram = 32;
  let maxNum = ns.getPurchasedServerLimit();
  for (let i = 0; i < maxNum; i++) {
    while (getSpendingMoney(ns) < ns.getPurchasedServerCost(ram)) {
      await ns.sleep(5000);
    }
    let name = ns.purchaseServer('home', ram);
    if (name != "") {
      copy_files(ns, name);
      ns.exec('/scripts/share.js', name, Math.floor(ram / 4));
    }
  }

  const serverNames = list_servers(ns).filter(s => s.indexOf('home-') == 0);
  let upgradedCount = 1;
  while (upgradedCount > 0){
    upgradedCount = 0;
    ram *= 2;
    for (let name of serverNames) {
      const cost = ns.getPurchasedServerUpgradeCost(name, ram);
      ns.print(`${name} ${ns.formatNumber(ram)} \$${ns.formatNumber(cost)}`);
      if (cost < 0 || !isFinite(cost)) {
        continue;
      }
      while (getSpendingMoney(ns) < cost) {
        await ns.sleep(5000);
      }
      ns.upgradePurchasedServer(name, ram);
      //ns.kill('/scripts/share.js', name);
      //ns.exec('/scripts/share.js', name, Math.floor(ram / 4));
      upgradedCount++;
    }
    await ns.sleep(500);
  }
}