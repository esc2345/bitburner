/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['help', false]]);
  if (args.help) {
    ns.tprint(`USAGE: run ${ns.getScriptName()} minutes`);
    ns.tprint(`> run ${ns.getScriptName()} 10`);
    return;
  }
  let mins = (typeof args._[0] == 'number') ? args._[0] : 0;
  mins *= 6;
  do {
    await ns.share();
    mins -= 1;
  } while (mins != 0);
}