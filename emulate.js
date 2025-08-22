function findElementByTagAndInnerText(tag, text, node = null) {
  const doc = (node == null) ? eval('document') : node;
  let elements = doc.getElementsByTagName(tag);
  for (let el of elements) {
    if (el.innerText == text) {
      return el;
    }
  }
  return null;
}

function findElementByTagAndAriaLabel(tag, text, node = null) {
  const doc = (node == null) ? eval('document') : node;
  let elements = doc.getElementsByTagName(tag);
  for (let el of elements) {
    if (el.getAttribute('aria-label') == text) {
      return el;
    }
  }
  return null;
}

function gotoCity(city) {
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
  let element = findElementByTagAndInnerText("p", "Travel");
  element.click();
  element = findElementByTagAndInnerText("h4", "Travel Agency");
  element = findElementByTagAndInnerText("span", cityCode, element.parentNode);
  element.click();
}

function gotoLocation(loc) {
  // goto city first
  let element = findElementByTagAndInnerText("p", "City");
  element.click();
  element = findElementByTagAndAriaLabel("span", loc, globalThis['root'].childNodes[1].childNodes[1]);
  if (element == null){
    throw new Error(`Invalid location: ${loc}`);
  }
  element.click();
}


/** @param {NS} ns */
export async function main(ns) {
  gotoLocation("Storm Technologies");
  await ns.sleep(3000);
  gotoLocation("The Slums");
  await ns.sleep(3000);
  gotoLocation("Joesguns");

}