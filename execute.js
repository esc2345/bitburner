import FILENAME from "/utils/filenames.js";
import PORTS from "/utils/portnumbers.js"

const MEM_W = 1.75, MEM_G = 1.75, MEM_H = 1.70, SLEEPTIME = 50;

function readJSONArray(ns, filename) {
  let data = [];
  if (ns.fileExists(filename)) {
    data = JSON.parse(ns.read(filename));
  }
  return data;
}

function saveJSONArray(ns, filename, data) {
  if (data.length > 0) {
    ns.write(filename, JSON.stringify(data), 'w');
  }
}

function updateRootedServers(ns, servers) {
  if (ns.peek(PORTS.numRooted) != 'NULL PORT DATA' && ns.peek(PORTS.numRooted) > servers.length) {
    servers = readJSONArray(ns, FILENAME.rootedServers);
    ns.tprint(`  servers: ${servers.length} / ${ns.peek(PORTS.numRooted)}`);
  }
  return servers;
}

/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['h', false]]);
  if (args.h || args._.length != 1) {
    ns.tprint(`usage: ${ns.getScriptName()} inputJSONfile`);
  }
  let batches = readJSONArray(ns, args._[0]);
  let servers = [];
  servers = updateRootedServers(ns, servers);
  let idx = 0;
  do {
    const b = batches.pop();
    if (b.batchType == 'hack') {
      batches.unshift(b);
    }
    //ns.print(`${b.batchType} ${b.target} ${b.tasks.length}`);
    const time = ns.getWeakenTime(b.target)
    for (const task of b.tasks) {
      let script, mem, threads = task.threads;
      switch (task.type) {
        case 'weaken': script = FILENAME.weakenScript; mem = MEM_W; break;
        case 'grow': script = FILENAME.growScript; mem = MEM_G; break;
        case 'hack': script = FILENAME.hackScript; mem = MEM_H; break;
        default: throw `Invalid task: ${task}`;
      }
      while (threads > 0) {
        const s = servers[idx];
        let ram = ns.getServerMaxRam(s) - ns.getServerUsedRam(s) - 2;
        if (s == 'home') ram -= 6;
        const n = Math.min(Math.floor(ram / mem), threads);
        if (n > 0 && ns.exec(script, s, n, b.target, time)) {
          threads -= n;
          await ns.sleep(SLEEPTIME);
        } else {
          if (serverIndex++ >= servers.length) serverIndex = 0;
          await ns.sleep(SLEEPTIME * 10);
        }
      }
    }
    batches = getBatchUpdates(ns, batches);
    servers = updateRootedServers(ns, servers);
  } while (batches.length > 0)
}