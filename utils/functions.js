function scan(ns, parent, server, list) {
  const children = ns.scan(server);
  for (let c of children) {
    if (parent != c) {
      list.push(c);
      scan(ns, server, c, list);
    }
  }
}

export function list_servers(ns) {
  let list = ['home'];
  scan(ns, '', 'home', list);
  return list;
}

export function copy_files(ns, dest) {
  let files = ns.ls('home', 'scripts/');
  files.push('connect.js');
  files.push('bitnode.txt');
  files.push('loop.js');
  files.push('utils.js');
  ns.scp(files, dest, 'home');
}


/*
https://github.com/bitburner-official/bitburner-src/blob/dev/src/Hacking.ts
hack money % - calculatePercentMoneyHacked(server, person);
calculateHackingTime, calculateGrowTime, calculateWeakenTime
  weakenTime = 4 * hackTime
  growthTime = 3.2 * hackTime

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Server/formulas/grow.ts
grow % - calculateServerGrowth(server, threads, person, cores);
grow amount - calculateGrowMoney(server, threads, person, cores);

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Server/ServerHelpers.ts
getWeakenEffect
  weaken lower security level by 0.05 * threads * (1 + (cores - 1) / 16) * currentNodeMults.ServerWeakenRate
  grow raise security level by 2 * 0.002 * threads

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Netscript/NetscriptHelpers.tsx
  hack raise security level by 0.002 * threads
*/
