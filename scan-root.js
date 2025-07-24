import { list_servers } from "utils/functions.js";

function root(ns, serverName) {
  const portTools = new Set();
  if (ns.fileExists('BruteSSH.exe')) portTools.add('BruteSSH');
  if (ns.fileExists('FTPCrack.exe')) portTools.add('FTPCrack');
  if (ns.fileExists('relaySMTP.exe')) portTools.add('relaySMTP');
  if (ns.fileExists('HTTPWorm.exe')) portTools.add('HTTPWorm');
  if (ns.fileExists('SQLInject.exe')) portTools.add('SQLInject');

  const s = ns.getServer(serverName);
  if (!s.hasAdminRights &&
    portTools.size >= s.numOpenPortsRequired &&
    ns.getHackingLevel() >= s.requiredHackingSkill) {
    for (const t of portTools) {
      if (s.openPortCount >= s.numOpenPortsRequired) {
        break;
      }
      switch (t) {
        case 'BruteSSH': ns.brutessh(serverName); break;
        case 'FTPCrack': ns.ftpcrack(serverName); break;
        case 'relaySMTP': ns.relaysmtp(serverName); break;
        case 'HTTPWorm': ns.httpworm(serverName); break;
        case 'SQLInject': ns.sqlinject(serverName); break;
      }
    }
    if (ns.nuke(serverName)) {
      ns.tprint(`nuked ${serverName}`);
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['show', false]]);
  const servers = list_servers(ns);
  for (let serverName of servers.filter(s => !ns.getServer(s).hasAdminRights))
    root(ns, serverName, args.showUnrooted);
  let numRooted = servers.filter(s => ns.getServer(s).hasAdminRights).length;
  ns.clearPort(1);
  ns.writePort(1, numRooted);
  ns.tprint(`servers = ${servers.length}, rooted = ${numRooted}`);
  if (args.show) {
    let unrooted = [];
    for (let serverName of servers.filter(s => !ns.getServer(s).hasAdminRights)) {
      const s = ns.getServer(serverName);
      unrooted.push([serverName, s.requiredHackingSkill, s.numOpenPortsRequired]);
    }
    ns.tprint('not rooted:')
    for (let row of unrooted.sort((a, b) => a[1] - b[1])) {
      ns.tprint(`  ${row[0].padEnd(20)} lvl: ${row[1]} ports: ${row[2]}`);
    }
  }
}
