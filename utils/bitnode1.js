import { wait_for_script, TODO } from "/utils/functions.js";
import { FNAMES } from "/utils/constants.js";


/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('getHackingLevel');
  ns.disableLog('getServerMaxRam');
  ns.disableLog('getServerMoneyAvailable');
  ns.disableLog('getPlayer');
  ns.disableLog('isRunning');
  ns.disableLog('sleep');

  const states = new Map();
  states.set('s0', {
    'message': 'Learn algorithms<br>to hack 50',
    'actions': [],
    'transitions': [{ 'condition': (ns) => ns.getHackingLevel() >= 10, 'next': 'hackJoesguns' }]
  });
  states.set('hackJoesguns', {
    'message': '',
    'actions': [{ 'type': 'wait', 'script': 'scan-root.js' }, { 'type': 'run', 'script': 'attack.js', 'param': 'joesguns' }],
    'transitions': [{ 'condition': (ns) => ns.getHackingLevel() >= 50, 'next': 'trainDex50' }]
  });
  states.set('trainDex50', {
    'message': 'Train dex to 50',
    'actions': [],
    'transitions': [{ 'condition': (ns) => ns.getPlayer().skills.dexterity >= 50, 'next': 'trainAgi50' }]
  });
  states.set('trainAgi50', {
    'message': 'Train agi to 50',
    'actions': [],
    'transitions': [{ 'condition': (ns) => ns.getPlayer().skills.agility >= 50, 'next': 'robStore' }]
  });
  states.set('robStore', {
    'message': 'Rob store to $1.2m',
    'actions': [],
    'transitions': [{ 'condition': (ns) => ns.getServerMoneyAvailable('home') >= 1.2e6, 'next': 'wait1b' }]
  });
  states.set('wait1b', {
    'message': 'Travel to Ishima<br>Join Tian Di Hui<br>Buy tor router & brutessh',
    'actions': [],
    'transitions': [{ 'condition': (ns) => ns.getServerMoneyAvailable('home') > 1e9, 'next': 'buyServers' }]
  });
  states.set('buyServers', {
    'message': '',
    'actions': [{ 'type': 'run', 'script': 'buy-servers.js', 'param': '' }],
    'transitions': [{ 'condition': (ns) => true, 'next': null }]
  });


  const sourceFiles = new Map(JSON.parse(ns.read(FNAMES.sourceFiles)));
  const augments = new Map(JSON.parse(ns.read(FNAMES.augments)));

  let id = 's0';
  let state = states.get(id);

  do {
    if (state.message != '') {
      TODO.setMessage(state.message);
      //ns.print(state.message);
      //ns.ui.openTail();
    }
    for (const a of state.actions) {
      switch (a.type) {
        case 'wait':
          await wait_for_script(ns, a.script);
          break;
        case 'run':
          ns.run(a.script, 1, a.param);
          break;
      }
    }
    const thisId = id;
    while (id == thisId) {
      for (const t of state.transitions) {
        if (t.condition(ns)) {
          id = t.next;
          state = states.get(id);
          //ns.print(id);
        }
      }
      await ns.sleep(100);
    }
  } while (id != null)
  TODO.deleteMessage();

  return

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