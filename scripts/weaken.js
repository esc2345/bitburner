/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['help', false]]);
  if (args.help || args._.length < 1 || args._.length > 2){
    ns.tprint(`Runs ${ns.getScriptName().slice(0,-3)} against target server.`);
    ns.tprint(`USAGE: run ${ns.getScriptName()}  TARGET_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  await ns.weaken(args._[0]);
}