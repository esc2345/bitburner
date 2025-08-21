import { wait_for_script } from "/utils/functions.js";
import { FNAMES } from "/utils/constants.js";

function disableLogs(ns){
  const temp = ['sleep', 'getHackingLevel', 'getServerMoneyAvailable', 'getWeakenTime', 'hasRootAccess', 'sleep'];
  for (const t of temp)
    ns.disableLog(t);
}

const automatic = [
  {
    'func': (ns) => ns.getHackingLevel() >= 10,
    'actions': [
      { 'type': 'wait', 'script': 'scan-root.js' },
      { 'type': 'run', 'script': 'attack.js', 'param': 'joesguns' }
    ]
  },
  {
    'func': (ns) => ns.getServerMoneyAvailable('home') >= 1e9,
    'actions': [{ 'type': 'run', 'script': 'buy-servers.js', 'param': null }]
  },
  {
    'func': (ns) => ns.hasRootAccess('joesguns') && ns.getWeakenTime('joesguns') < 60000,
    'actions': [{ 'type': 'run', 'script': 'share-all.js', 'param': null }]
  }
];

const manual = [
  {
    'text': 'Hack 50 (learn algorithms)',
    'func': (ns) => ns.getHackingLevel() >= 50
  },
  {
    'text': 'Dex 50',
    'func': (ns) => ns.getPlayer().skills.dexterity >= 50
  },
  {
    'text': 'Agi 50',
    'func': (ns) => ns.getPlayer().skills.agility >= 50
  },
  {
    'text': '$1.2m (rob store)',
    'func': (ns) => ns.getServerMoneyAvailable('home') >= 1.2e6
  },
  {
    'text': 'Join Tian Di Hui (Ishima, $1m, hack 50)',
    'func': (ns) => ns.getPlayer().factions.includes('Tian Di Hui')
  },
  {
    'text': 'BruteSSH (buy tor router & brutessh)',
    'func': (ns) => ns.fileExists('BruteSSH.exe')
  },
  {
    'text': 'Join CyberSec (backdoor CSEC, hack 60, 1 port)',
    'func': (ns) => ns.getPlayer().factions.includes('CyberSec')
  },
  {
    'text': 'CyberSec rep 3.75k',
    'func': (ns) => ns.getPlayer().factions.includes('CyberSec')
  },
  {
    'text': 'Tian Di Hui rep 6.25k',
    'func': (ns) => ns.getPlayer().factions.includes('CyberSec')
  },
  {
    'text': 'Join Sector-12 (Sector-12, $15m)',
    'func': (ns) => ns.getPlayer().factions.includes('Sector-12')
  },
  {
    'text': 'Join Aevum (Aevum, $40m)',
    'func': (ns) => ns.getPlayer().factions.includes('Aevum')
  }
];


/** @param {NS} ns */
export async function main(ns) {
  disableLogs(ns);

  let indexA = 0;
  while (automatic.length > 0) {
    //ns.print(`${automatic.length} : ${indexA} ${automatic[indexA].func(ns)}`);
    if (automatic[indexA].func(ns)) {
      const actions = automatic[indexA].actions;
      for (const action of actions) {
        if (action.type == 'wait') {
          await wait_for_script(ns, action.script);
        }
        if (action.type == 'run') {
          if (action.param == null) {
            ns.run(action.script);
          } else {
            ns.run(action.script, 1, action.param);
          }
        }
      }
      let removed = automatic.splice(indexA, 1);
      //ns.tprint(removed);
    }
    if (++indexA >= automatic.length) { indexA = 0; }
    await ns.sleep(1000);
  }
}
