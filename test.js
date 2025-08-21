import { TODO } from "utils/functions.js";
import { PORTS, FNAMES } from "/utils/constants.js";

async function doTerminal(ns, text) {
  const doc = eval('document');
  const terminalInput = doc.getElementById("terminal-input");
  terminalInput.focus();
  terminalInput.value = text;

 const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13, // Deprecated, but still widely used for compatibility
      which: 13,  // Deprecated, but still widely used for compatibility
      bubbles: true, // Allows the event to bubble up the DOM tree
      cancelable: true, // Allows the default action to be prevented
    });

  const handler = Object.keys(terminalInput)[1];
  terminalInput[handler].onChange({ target: terminalInput });
//  terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null }); //enter
    terminalInput.dispatchEvent(enterEvent);
}


/** @param {NS} ns */
export async function main(ns) {

  //ns.tprint(ns.getResetInfo());
  //ns.tprint(ns.getPlayer());
  ns.tprint(ns.getServer('home'));
  ns.tprint(`home    ${ns.formatRam(ns.getServerMaxRam('home'))}`);
  //ns.tprint(`home-0  ${ns.formatRam(ns.getServerMaxRam('home-0'))}`);
  //ns.tprint(`home-24 ${ns.formatRam(ns.getServerMaxRam('home-24'))}`);

  await doTerminal(ns, 'connect n00dles');

  return
  const { currentNode, ownedAugs, ownedSF } = ns.getResetInfo();
  ns.tprint(ownedAugs);

  //let json =JSON.stringify([...ownedAugs]);
  //ns.tprint(json);
  //ns.tprint(new Map(JSON.parse(json)));

  const augments = ownedAugs;
  const sourceFiles = ownedSF;
  ns.tprint(augments.size);
  let resetCounter = 0;
  if (augments.has('Social Negotiation Assistant (S.N.A)')) {
    resetCounter = 1;
  }
  if (augments.has('CashRoot Starter Kit')) {
    resetCounter = 2;
  }
  ns.tprint(resetCounter);
}