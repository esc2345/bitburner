/** @param {NS} ns */
export async function main(ns) {
  for(let i = 1; i<=10;i++){
    ns.tprint(`port ${i}: ${ns.peek(i)}`);
  }
}