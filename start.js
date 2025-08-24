import { UIController, findByTagAndInnerText } from "/utils/controller.js";
import { wait_for_script } from "/utils/functions.js";
import { PORTS } from "/utils/constants.js";

async function lowRam(ns) {
  const spoof = new UIController(ns);
  spoof.gotoCity('Sector-12');
  spoof.gotoLocation('Powerhouse Gym');
  await spoof.trainSkill('dex', 20);
  spoof.gotoLocation('Powerhouse Gym');
  await spoof.trainSkill('agi', 20);
  ns.tprint('* * * start shoplifting * * *');
  // await spoof.doCrime('shoplift', 1.02e6);
  while (ns.getServerMoneyAvailable('home') < 1.02e6) {
    await ns.sleep(1000);
  }
  spoof.gotoLocation('Alpha Enterprises');
  findByTagAndInnerText('button', "Upgrade 'home' RAM", 'contains').click();
  // soft reset
  findByTagAndInnerText('p', 'Options').click();
  findByTagAndInnerText('button', 'Soft Reset').click();
  findByTagAndInnerText('button', 'Confirm').click();
}

/** @param {NS} ns */
export async function main(ns) {
  if (ns.getServerMaxRam('home') < 16) {
    lowRam(ns);
  } else {
    const scripts = [
      '/utils/setup.js',
      'scan-root.js'
    ];
    for (const s of scripts) {
      ns.tprint(`running ${s}`);
      await wait_for_script(ns, s);
    }

    const currentNode = ns.peek(PORTS.currentNode);
    ns.tprint(`current bitnode = ${currentNode}`);

    switch (currentNode) {
      case 1:
        ns.run('/utils/bitnode1.js');
        break;
    }
  }
}
