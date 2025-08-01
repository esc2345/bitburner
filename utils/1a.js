import FILENAME from "utils/filenames.js";

/** @param {NS} ns */
export async function main(ns) {
  ns.tprint('.');
  try {
    mults = ns.getBitNodeMultipliers();
    ns.write(FILENAME.bitnode, JSON.stringify(mults), 'w');
  } catch (e) { }
}