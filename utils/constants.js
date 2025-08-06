/*
Port numbers for commnication across scripts
*/
export class PORTS {
  static numRooted = 1; // port #1 for number of rooted servers
}

/*
Filenames used across scripts
*/
export class FNAMES {
  static bitnode = '/temp/bitnode.json';
  static rootedServers = '/temp/rooted.json';
  static weakenScript = '/scripts/weaken.js';
  static growScript = '/scripts/grow.js';
  static hackScript = '/scripts/hack.js';
}

/*
Script sizes
*/
export class MEM {
  static W = 1.75;
  static G = 1.75;
  static H = 1.70;
}