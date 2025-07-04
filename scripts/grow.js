/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['help', false]]);
  if (args.help || args._.length != 2){
    ns.tprint(`Runs ${ns.getScriptName().slice(0,-3)} against target server.`);
    ns.tprint(`USAGE: run ${ns.getScriptName()}  TARGET_NAME WEAKENTIME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles 4000`);
    return;
  }
  let target = args._[0];
  let delay = Math.max(1, args._[1] - ns.getGrowTime(target));
  await ns.grow(target, {"additionalMsec": delay});
}