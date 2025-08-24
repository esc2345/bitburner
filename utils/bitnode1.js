import { UIController, findByTagAndInnerText, dismissModal } from "/utils/controller.js";
import { wait_for_script } from "/utils/functions.js";
import { FNAMES } from "/utils/constants.js";


/** @param {NS} ns */
export async function main(ns) {
  let node = null;
  const spoof = new UIController(ns);
  spoof.gotoCity('Sector-12');
  spoof.gotoLocation('Rothman University');
  await spoof.trainSkill('hack', 50);
  spoof.gotoLocation('Powerhouse Gym');
  await spoof.trainSkill('dex', 50);
  spoof.gotoLocation('Powerhouse Gym');
  await spoof.trainSkill('agi', 50);
  spoof.gotoLocation('The Slums');
  await spoof.doCrime('rob store', 1.25e6);
  spoof.gotoCity('Ishima');
  do {
    await ns.sleep(500);
    node = findByTagAndInnerText('button', 'Join');
  } while (node == null)
  node.click();
  spoof.gotoLocation('Storm Technologies');
  doTerminalCommand(ns, 'buy BruteSSH.exe');

  return;


  ns.disableLog('getHackingLevel');
  ns.disableLog('getServerMaxRam');
  ns.disableLog('getServerMoneyAvailable');
  ns.disableLog('getPlayer');
  ns.disableLog('isRunning');
  ns.disableLog('sleep');


  const sourceFiles = new Map(JSON.parse(ns.read(FNAMES.sourceFiles)));
  const augments = new Map(JSON.parse(ns.read(FNAMES.augments)));

  let resetCounter = 1;
  if (augments.has('Social Negotiation Assistant (S.N.A)')) resetCounter++;
  if (augments.has('CashRoot Starter Kit')) resetCounter++;
  if (augments.has('Neural-Retention Enhancement')) resetCounter++;
  if (augments.has('Neuroreceptor Management Implant')) resetCounter++;
  ns.tprint(`reset counter = ${resetCounter}`);

  if (resetCounter > 3) {
    if (ns.getServerMoneyAvailable('home') > 1e9 && !ns.isRunning('buy-servers.js') && ns.getServerMaxRam('home-24') < 1048576) {
      ns.tprint('running buy-servers.js');
      ns.run('buy-servers.js');
      message(ns, 'run attack.js harakiri-sushi');
      message(ns, 'run attack.js phantasy');
      message(ns, 'Hack Nitesec until 50k rep');
      stage++
    }

    try {
      if (ns.getServerMaxRam('home-24') >= 4096 && !ns.isRunning('share-all.js')) {
        ns.tprint('running share-all.js');
        ns.run('share-all.js');
        stage++
      }
    } catch (e) { }
  }
}