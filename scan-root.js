import { list_servers } from "utils/functions.js";
import FILENAME from "utils/filenames.js";
import PORTS from "utils/portnumbers.js";

const targets = new Set([
  'joesguns', 'phantasy', 'catalyst', 'applied-energetics', 
  '4sigma', 'omnitek', 'megacorp', 'blade', 'ecorp'
]);

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
      if (targets.has(serverName)){
        ns.tprint(`hacking ${serverName}`);
      }
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['s', false], ['show', false]]);
  const servers = list_servers(ns).sort((a, b) => ns.getServerRequiredHackingLevel(a) - ns.getServerRequiredHackingLevel(b));
  for (let serverName of servers.filter(s => !ns.hasRootAccess(s)))
    root(ns, serverName);
  let rooted = servers.filter(s => ns.hasRootAccess(s));
  ns.write(FILENAME.rootedServers, JSON.stringify(rooted), 'w');
  ns.clearPort(PORTS.numRooted);
  ns.writePort(PORTS.numRooted, rooted.length);
  ns.tprint(`servers = ${servers.length}, rooted = ${rooted.length}`);
  if (args.s || args.show) {
    ns.tprint('unrooted:');
    for (const s of servers.filter(s => !ns.hasRootAccess(s))) {
      ns.tprint(`  ${s.padEnd(20)} ${ns.getServerRequiredHackingLevel(s).toString().padStart(4)} ${ns.getServerNumPortsRequired(s)}`);
    }
  }
}
