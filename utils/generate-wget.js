/** @param {NS} ns */
export async function main(ns) {
  const fname = 'utils/wget.js';
  const files = [];
  for (let file of ns.ls('home')) {
    if (file.indexOf('.js') > 0) {
      files.push(`'${file}'`);
    }
  }
  const template = `/** @param {NS} ns */
export async function main(ns) {
  const githubBase = 'https://raw.githubusercontent.com/esc2345/bitburner/refs/heads/main/';
  const files = [
    ${files.join(',\n    ')}
  ]
  for (let f of files) {
    let url = githubBase + f;
    await ns.wget(url, f);
  }
}`;
  ns.write(fname, template, 'w');
}