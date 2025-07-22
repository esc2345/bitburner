/** @param {NS} ns */
export async function main(ns) {

  ns.tprint(ns.growthAnalyze('joesguns', 100/98.6));
  return;

  const target = 'foodnstuff';

  const servers = ['omega-net', 'iron-gym', 'phantasy', 'zer0', 'neo-net', 'max-hardware'];

  while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)){
  const sec = ns.getServerSecurityLevel(target).toFixed(3);
  const money = ns.getServerMoneyAvailable(target);
  const pct = money / ns.getServerMaxMoney(target) * 100;
  ns.tprint(`${sec} , ${money} ${pct.toFixed(3)}`);
  for (let s of servers) {
    ns.exec('scripts/grow.js', s, 15, target, 0);
    ns.exec('scripts/weaken.js', s, 2, target);
    await ns.sleep(30);
  }
await ns.sleep(38000);}
}