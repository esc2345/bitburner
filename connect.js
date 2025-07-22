function getPath(ns, parent, server, target) {
  const children = ns.scan(server).filter(s => parent != s);
  //ns.tprint(`${server}: ${children}`)
  for (const c of children) {
    if (c == target) return [c];
  }
  for (const c of children) {
    let result = getPath(ns, server, c, target);
    if (result.length > 0) return [c].concat(result);
  }
  return []
}

export async function main(ns) {
  const args = ns.flags([['help', false]]);
  if (args.help || args._.length != 1) {
    ns.tprint(`Returns command to connect to server.`);
    ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  let path = ['home'].concat(getPath(ns, '', 'home', args._[0]));
  if (path.length > 1) {
    let command = path.join(";connect ") + ';backdoor';
    navigator.clipboard.writeText(command);
    ns.tprint(`copied to clipboard:\n${command}`);

  } else { ns.tprint(`${args._[0]} not found `) }
}

/**
 * @param {AutocompleteData} data - context about the game, useful when autocompleting
 * @param {string[]} args - current arguments, not including "run script.js"
 * @returns {string[]} - the array of possible autocomplete options
 */
export function autocomplete(data, args) {
  // Example: Suggest server names based on user input
  if (args.length === 1) {
    return data.servers; // Suggest all server names
  } else if (args.length === 2 && args[0] === "--target") {
    return data.servers; // Suggest server names for the --target flag
  }
  return []; // No suggestions if no relevant input
}
