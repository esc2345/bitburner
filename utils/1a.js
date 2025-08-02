import { FNAMES } from "/utils/constants.js";

/** @param {NS} ns */
export async function main(ns) {
  ns.tprint('.');
  try {
    mults = ns.getBitNodeMultipliers();
    ns.write(FNAMES.bitnode, JSON.stringify(mults), 'w');
  } catch (e) { }
}