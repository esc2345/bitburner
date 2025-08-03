import { list_servers } from "utils/functions.js";

/** @param {NS} ns */
export async function main(ns) {
  const servers = list_servers(ns);
  for (const name of servers) {
    if (name.indexOf('home-') == 0) {
      ns.kill('scripts/share.js', name);
      const mem = ns.getServerMaxRam(name) - ns.getServerUsedRam(name);
      const t = Math.floor(mem / 4);
      if (t > 0) {
        ns.exec('scripts/share.js', name, t);
      }
    }
  }
}