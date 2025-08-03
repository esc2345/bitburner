import { list_servers } from "/utils/functions.js";
import { PORTS, FNAMES } from "/utils/constants.js";


function root(ns, serverName) {
  const portTools = new Set();
  if (ns.fileExists('BruteSSH.exe')) portTools.add('BruteSSH');
  if (ns.fileExists('FTPCrack.exe')) portTools.add('FTPCrack');
  if (ns.fileExists('relaySMTP.exe')) portTools.add('relaySMTP');
  if (ns.fileExists('HTTPWorm.exe')) portTools.add('HTTPWorm');
  if (ns.fileExists('SQLInject.exe')) portTools.add('SQLInject');

  if (!ns.hasRootAccess(serverName) &&
    portTools.size >= ns.getServerNumPortsRequired(serverName) &&
    ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverName)) {
    let count = 0;
    for (const t of portTools) {
      if (count >= ns.getServerNumPortsRequired(serverName)) {
        break;
      }
      switch (t) {
        case 'BruteSSH': ns.brutessh(serverName); count++; break;
        case 'FTPCrack': ns.ftpcrack(serverName); count++; break;
        case 'relaySMTP': ns.relaysmtp(serverName); count++; break;
        case 'HTTPWorm': ns.httpworm(serverName); count++; break;
        case 'SQLInject': ns.sqlinject(serverName); count++; break;
      }
    }
    if (ns.nuke(serverName)) {
      ns.tprint(`nuked ${serverName}`);
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['s', false], ['show', false]]);
  const servers = list_servers(ns);
  for (let serverName of servers.filter(s => !ns.hasRootAccess(s)))
    root(ns, serverName);
  const rooted = servers.filter(s => ns.hasRootAccess(s));
  const available = rooted.filter(s => ns.getServerMaxRam(s) > 0);
  ns.write(FNAMES.rootedServers, JSON.stringify(available), 'w');
  ns.clearPort(PORTS.numRooted);
  ns.writePort(PORTS.numRooted, available.length);
  ns.tprint(`servers = ${servers.length}, rooted = ${rooted.length}, available = ${available.length}`);
  if (args.s || args.show) {
    ns.tprint('unrooted:');
    for (const s of servers.filter(s => !ns.hasRootAccess(s))) {
      ns.tprint(`  ${s.padEnd(20)} ${ns.getServerRequiredHackingLevel(s).toString().padStart(4)} ${ns.getServerNumPortsRequired(s)}`);
    }
  }
}
