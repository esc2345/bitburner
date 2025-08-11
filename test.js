import { FNAMES } from "/utils/constants.js";

/** @param {NS} ns */
export async function main(ns) {
  const { currentNode, ownedAugs, ownedSF } = ns.getResetInfo();
  ns.tprint(ownedAugs);

  //let json =JSON.stringify([...ownedAugs]);
  //ns.tprint(json);
  //ns.tprint(new Map(JSON.parse(json)));

  const augments = ownedAugs;
  const sourceFiles = ownedSF;
  ns.tprint(augments.size);
  let resetCounter = 0;
  if(augments.has('Social Negotiation Assistant (S.N.A)')){
    resetCounter = 1;
  }
  if(augments.has('CashRoot Starter Kit')){
    resetCounter = 2;
  }
  ns.tprint(resetCounter);
}