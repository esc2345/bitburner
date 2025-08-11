import { list_servers } from "/utils/functions.js";
import { PORTS, FNAMES } from "/utils/constants.js";


function root(ns, serverName) {
  let count = 0;
  if (ns.fileExists('BruteSSH.exe')) {
    ns.brutessh(serverName);
    count++;
  }
  if (ns.fileExists('FTPCrack.exe')) {
    ns.ftpcrack(serverName);
    count++;
  }
  if (ns.fileExists('relaySMTP.exe')) {
    ns.relaysmtp(serverName);
    count++;
  }
  if (ns.fileExists('HTTPWorm.exe')) {
    ns.httpworm(serverName);
    count++;
  }
  if (ns.fileExists('SQLInject.exe')) {
    ns.sqlinject(serverName);
    count++;
  }

  if (!ns.hasRootAccess(serverName) &&
    count >= ns.getServerNumPortsRequired(serverName) &&
    ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverName)) {
    if (ns.nuke(serverName)) {
      ns.tprint(`nuked ${serverName}`);
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['s', false], ['show', false]]);

  const servers = list_servers(ns);
  for (let serverName of servers.filter(s => !ns.hasRootAccess(s))) {
    root(ns, serverName);
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
  ns.tprint(`servers = ${servers.length}, targets = ${targets.length}, workers = ${workers.length}`);
  if (args.s || args.show) {
    ns.tprint(`# port tools: ${portTools.size}, unrooted:`);
    for (
      const s of servers
        .filter(s => !ns.hasRootAccess(s))
        .sort((a, b) => ns.getServerRequiredHackingLevel(a) - ns.getServerRequiredHackingLevel(b))
    ) {
      ns.tprint(`  ${s.padEnd(20)} ${ns.getServerRequiredHackingLevel(s).toString().padStart(4)} ${ns.getServerNumPortsRequired(s)}`);
    }
  }
}
