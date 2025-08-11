/*
Port numbers for commnication across scripts
*/
export class PORTS {
  static workers = 1; // port #1 for number of rooted servers
}

/*
Filenames used across scripts
*/
export class FNAMES {
  static bitnode = '/temp/bitnode.json';
  static augments = '/temp/augments.json';
  static sourceFiles = '/temp/source-files.json';
  static hackMults = '/temp/hackMults.json';
  static workers = '/temp/workers.json';
  static targets = '/temp/targets.json';
  static weakenScript = '/scripts/weaken.js';
  static growScript = '/scripts/grow.js';
  static hackScript = '/scripts/hack.js';
  static shareScript = '/scripts/share.js';
}

/*
Script sizes
*/
export class MEM {
  static W = 1.75;
  static G = 1.75;
  static H = 1.70;
  static SHARE = 4.0;
}