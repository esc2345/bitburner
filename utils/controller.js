/** @param {NS} ns */

export async function doTerminalCommand(text) {
  const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13, // Deprecated, but still widely used for compatibility
    which: 13,  // Deprecated, but still widely used for compatibility
    bubbles: true, // Allows the event to bubble up the DOM tree
    cancelable: true, // Allows the default action to be prevented
  });

  findAndClick('p', 'Terminal');
  const doc = eval('document');
  let terminalInput = doc.getElementById("terminal-input");
  while (!terminalInput) {
    terminalInput = doc.getElementById("terminal-input");
    await new Promise(resolve => setTimeout(resolve, 500)); 
  }
  terminalInput.focus();
  terminalInput.value = text;

  const handler = Object.keys(terminalInput)[1];
  terminalInput[handler].onChange({ target: terminalInput });
  //  terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null }); //enter
  terminalInput.dispatchEvent(enterEvent);
}


export function findNode(tag, text, mode = 'exact') {
  const doc = eval('document');
  const elements = doc.getElementsByTagName(tag);
  for (let el of elements) {
    switch (mode) {
      case 'exact':
        if (el.innerText == text) { return el; }
        break;
      case 'contains':
        if (mode == 'contains' && el.innerText.indexOf(text) >= 0) { return el; }
        break;
      default:
        throw new Error(`findNode invalid mode: ${mode}`);
    }
  }
  return null;
}

export async function findAndClick(tag, text, mode = 'exact') {
  let limit = 10;
  let node = findNode(tag, text, mode);
  while (node == null && limit > 0){
    await new Promise(resolve => setTimeout(resolve, 500)); 
    node = findNode(tag, text, mode);
    limit--;
  }
  if (node == null){
    throw new Error(`node not found: ${tag} ${text} ${mode}`);
  } else {
    node.click();
  }
}

export function findByTagAndAriaLabel(tag, text) {
  const doc = eval('document');
  const elements = doc.getElementsByTagName(tag);
  for (let el of elements) {
    if (el.getAttribute('aria-label') == text) {
      return el;
    }
  }
  return null;
}

export function dismissModal() {
  const strings = [
    'After training',
    'After studying',
    'After taking',
    'You worked',
    'You finished working',
    'You have purchased'
  ];
  for (const str of strings) {
    let element = findByTagAndInnerText('span', str, 'contains');
    if (element != null) {
      element.parentNode.parentNode.parentNode.firstChild.click();
      break;
    }
  }
}

export class UIController {
  constructor(ns) {
    this.ns = ns;
  }

  gotoCity(city) {
    let cityCode;
    switch (city) {
      case 'Sector-12':
      case 'Aevum':
      case 'Volhaven':
      case 'Chongqing':
      case 'New Tokyo':
      case 'Ishima':
        cityCode = city[0];
        break;
      default:
        throw new Error(`Invalid city: ${city}`);
    }
    let element = findByTagAndInnerText('p', 'Travel');
    element.click();
    element = findByTagAndInnerText('span', cityCode);
    element.click();
  }

  gotoLocation(loc) {
    let element = findByTagAndInnerText('p', 'City');
    element.click();
    element = findByTagAndAriaLabel('span', loc);
    if (element == null) {
      throw new Error(`Invalid location: ${loc}`);
    }
    element.click();
  }

  async trainSkill(skill, level) {
    let text, func;
    switch (skill) {
      case 'hack':
        text = 'Take Algorithms';
        func = (ns) => ns.getPlayer().skills.hacking < level;
        break;
      case 'str':
        text = 'Train Strength';
        func = (ns) => ns.getPlayer().skills.strength < level;
        break;
      case 'def':
        text = 'Train Defense';
        func = (ns) => ns.getPlayer().skills.defense < level;
        break;
      case 'dex':
        text = 'Train Dexterity';
        func = (ns) => ns.getPlayer().skills.dexterity < level;
        break;
      case 'agi':
        text = 'Train Agility';
        func = (ns) => ns.getPlayer().skills.agility < level;
        break;
      case 'cha':
        text = 'Take Leadership';
        func = (ns) => ns.getPlayer().skills.charisma < level;
        break;
    }
    this.ns.print(`skill: ${skill} ${level} ${text}`);
    let element = findByTagAndInnerText('button', text, 'contains');
    element.click();
    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      dismissModal();
    } while (func(this.ns))
    element = findByTagAndInnerText('button', 'Do something else simultaneously');
    element.click();
  }

  async doCrime(type, money) {
    this.gotoLocation('The Slums');
    let text;
    switch (type) {
      case 'shoplift':
        text = 'Shoplift';
        break;
      case 'rob store':
        text = 'Rob Store';
        break;
      case 'mug':
        text = 'Mug';
        break;
      case 'larceny':
        text = 'Larceny';
        break;
      case 'deal drugs':
        text = 'Deal Drugs';
        break;
      case 'bond forgery':
        text = 'Bond Forgery';
        break;
      case 'traffick arms':
        text = 'Traffick Arms';
        break;
      case 'homicide':
        text = 'Homicide';
        break;
      case 'grand theft auto':
        text = 'Grand Theft Auto';
        break;
      case 'kidnap':
        text = 'Kidnap';
        break;
      case 'assassination':
        text = 'Assassination';
        break;
      case 'heist':
        text = 'Heist';
        break;
      default:
        throw new Error(`Invalid crime: ${type}`);
    }
    this.ns.print(`crime: ${type} ${money} ${text}`);
    let element = findByTagAndInnerText('button', text, 'contains');
    element.click();
    this.ns.alert(`Click ${text}.`);
    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      dismissModal();
    } while (this.ns.getServerMoneyAvailable('home') < money)
    element = findByTagAndInnerText('button', 'Do something else simultaneously');
    element.click();
  }

  async purchaseTorRouter(){
    findByTagAndInnerText('button', "Purchase TOR router", 'contains').click();
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      dismissModal();
  }
}

export async function main(ns) {

  const spoof = new UIController(ns);
  findByTagAndInnerText('p', 'Options').click();
  findByTagAndInnerText('button', 'Soft Reset').click();
  findByTagAndInnerText('button', 'Confirm').click();


  return

}