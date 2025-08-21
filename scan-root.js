import { list_servers } from "/utils/functions.js";
import { PORTS, FNAMES } from "/utils/constants.js";


/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['s', false], ['show', false]]);

  const portTools = [];
  if (ns.fileExists('BruteSSH.exe')) portTools.push(ns.brutessh);
  if (ns.fileExists('FTPCrack.exe')) portTools.push(ns.ftpcrack);
  if (ns.fileExists('relaySMTP.exe')) portTools.push(ns.relaysmtp);
  if (ns.fileExists('HTTPWorm.exe')) portTools.push(ns.httpworm);
  if (ns.fileExists('SQLInject.exe')) portTools.push(ns.sqlinject);

  const servers = list_servers(ns);
  const hackLevel = ns.getHackingLevel();
  for (let serverName of servers.filter(s =>
    !ns.hasRootAccess(s) &&
    hackLevel >= ns.getServerRequiredHackingLevel(s) &&
    portTools.length >= ns.getServerNumPortsRequired(s))) {
    for (const f of portTools) {
      f(serverName);
    }
    if (ns.nuke(serverName)) {
      ns.tprint(`nuked ${serverName}`);
    }
  }

  const rooted = servers.filter(s => ns.hasRootAccess(s));
  const workers = rooted.filter(s => ns.getServerMaxRam(s) > 0);
  ns.write(FNAMES.workers, JSON.stringify(workers), 'w');
  ns.clearPort(PORTS.workers);
  ns.writePort(PORTS.workers, workers.length);
  const targets = rooted
    .filter(s => ns.getServerMaxMoney(s) > 0)
    .sort((a, b) => ns.getServerRequiredHackingLevel(a) - ns.getServerRequiredHackingLevel(b));
  ns.write(FNAMES.targets, JSON.stringify(targets), 'w');
  ns.tprint(`servers = ${rooted.length}/${servers.length}, targets = ${targets.length}, workers = ${workers.length}`);


  if (args.s || args.show) {
    ns.tprint(` unrooted:`);
    for (
      const s of servers
        .filter(s => !ns.hasRootAccess(s))
        .sort((a, b) => ns.getServerRequiredHackingLevel(a) - ns.getServerRequiredHackingLevel(b))
    ) {
      ns.tprint(`  ${s.padEnd(20)} ${ns.getServerRequiredHackingLevel(s).toString().padStart(4)} ${ns.getServerNumPortsRequired(s)}`);
    }
  }
}
