import { doTerminalCommand } from "/utils/controller.js";
import { list_servers } from "/utils/functions.js";

function getPath(ns, parent, server, target) {
  const children = ns.scan(server).filter(s => parent != s);
  //ns.tprint(`${server}: ${children}`)
  for (const c of children) {
    if (c == target) return [c];
  }
  for (const c of children) {
    let result = getPath(ns, server, c, target);
    if (result.length > 0) return [c].concat(result);
  }
  return []
}

/** @param {NS} ns */
export async function main(ns) {
  const toBackdoor = list_servers(ns).filter((s) => ns.getServer(s).hasAdminRights &&
   !ns.getServer(s).backdoorInstalled &&
   !ns.getServer(s).purchasedByPlayer);
  ns.tprint(`attempting to backdoor: ${toBackdoor}`);
  for (const serverName of toBackdoor) {
    const path = ['home'].concat(getPath(ns, '', 'home', serverName));
    const command = path.join(";connect ") + ';backdoor';
    await doTerminalCommand(ns, command);
    await ns.sleep(ns.getHackTime(serverName) / 4 + 1000);
  }

}