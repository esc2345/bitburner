import { FNAMES } from "/utils/constants.js";

function scan(ns, parent, server, list) {
  const children = ns.scan(server);
  for (let c of children) {
    if (parent != c) {
      list.push(c);
      scan(ns, server, c, list);
    }
  }
}

export function list_servers(ns) {
  let list = [];
  scan(ns, '', 'home', list);
  list.push('home');
  return list;
}


export function copy_files(ns, dest) {
  let files = ns.ls('home', 'scripts/');
  ns.scp(files, dest, 'home');
}


export async function wait_for_script(ns, scriptName) {
  let pid = ns.run(scriptName);
  while (ns.isRunning(pid)) {
    await ns.sleep(100);
  }
}


export async function emulateTerminalCommand(ns, text) {
  const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13, // Deprecated, but still widely used for compatibility
    which: 13,  // Deprecated, but still widely used for compatibility
    bubbles: true, // Allows the event to bubble up the DOM tree
    cancelable: true, // Allows the default action to be prevented
  });

  const doc = eval('document');
  let terminalInput = doc.getElementById("terminal-input");
  while (!terminalInput){
    terminalInput = doc.getElementById("terminal-input");
    await ns.sleep(100);
  }
  terminalInput.focus();
  terminalInput.value = text;

  const handler = Object.keys(terminalInput)[1];
  terminalInput[handler].onChange({ target: terminalInput });
  //  terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null }); //enter
  terminalInput.dispatchEvent(enterEvent);
}




export class TODO {
  static setMessage(msg) {
    let temp_p, temp_d;
    temp_p = globalThis['myMessage'];
    if (!temp_p) {
      eval("temp_p = document.createElement('p')");
      temp_p.className = globalThis['root'].firstChild.childNodes[0].getElementsByTagName('P')[0].className;
      temp_p.style.textAlign = 'center';
      temp_p.style.color = 'white';
      temp_p.id = 'myMessage';

      eval("temp_d = document.createElement('div')");
      temp_d.className = globalThis['root'].firstChild.childNodes[1].firstChild.firstChild.childNodes[1].className;
      temp_d.id = 'myMessageContainer';
      temp_d.appendChild(temp_p);
      globalThis['root'].firstChild.childNodes[1].firstChild.firstChild.appendChild(temp_d);
    }
    temp_p.innerHTML = msg;

  }
  static deleteMessage() {
    globalThis['myMessageContainer'].parentNode.removeChild(globalThis['myMessageContainer']);
  }
}

/*
https://github.com/bitburner-official/bitburner-src/blob/dev/src/Hacking.ts
hack money % - calculatePercentMoneyHacked(server, person);
calculateHackingTime, calculateGrowTime, calculateWeakenTime
  weakenTime = 4 * hackTime
  growthTime = 3.2 * hackTime

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Server/formulas/grow.ts
grow % - calculateServerGrowth(server, threads, person, cores);
grow amount - calculateGrowMoney(server, threads, person, cores);

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Server/ServerHelpers.ts
getWeakenEffect
  weaken lower security level by 0.05 * threads * (1 + (cores - 1) / 16) * currentNodeMults.ServerWeakenRate
  grow raise security level by 2 * 0.002 * threads

https://github.com/bitburner-official/bitburner-src/blob/dev/src/Netscript/NetscriptHelpers.tsx
  hack raise security level by 0.002 * threads
*/

export function estimate_grow_cycles(ns, target, ratio, threads, cores = 1) {
  const MULTS = JSON.parse(ns.read(FNAMES.bitnode));
  const adjGrowthLog = Math.min(
    Math.log1p(0.03 / target.minDifficulty),
    0.00349388925425578
  );
  const adjServerGrowth = (target.serverGrowth / 100) * MULTS.ServerGrowthRate;
  const playerHackMults = JSON.parse(ns.read(FNAMES.hackMults));
  const coreBonus = 1 + (cores - 1) / 16;
  const serverGrowthLog =
    adjGrowthLog * adjServerGrowth * playerHackMults.growth * coreBonus * threads;
  const logServerGrowthRate = Math.log(Math.max(Math.exp(serverGrowthLog), 1));
  return 1 + Math.ceil(Math.log(ratio) / logServerGrowthRate);
}

export function estimate_hack_percent(ns, server) {
  // expressed in decimal form 1.00 = 100%
  const MULTS = JSON.parse(ns.read(FNAMES.bitnode));
  const playerHackMults = JSON.parse(ns.read(FNAMES.hackMults));
  const difficultyMult = (100 - server.hackDifficulty) / 100;
  const playerHackLevel = ns.getHackingLevel();
  const skillMult = (playerHackLevel - (server.requiredHackingSkill - 1)) / playerHackLevel;
  const percentMoneyHacked =
    (difficultyMult * skillMult * playerHackMults.money * MULTS.ScriptHackMoney) / 240;
  return Math.min(1, Math.max(percentMoneyHacked, 0));
}

