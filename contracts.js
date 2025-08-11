import { list_servers } from "utils/functions.js";

class ContractSolver {
  static canSolve(type) {
    switch (type) {
      case "Square Root":
        return true;
        break;
      case "Sanitize Parentheses in Expression":
      default:
        return false
    }
  }
  static solve(type, data) {
    switch (type) {
      case "Sanitize Parentheses in Expression": return ContractSolver.allBalancedParentheses(data);
      case "Square Root": return ContractSolver.bigIntSqrt(data);
    }
  }
  static bigIntSqrt(value) {
    // https://www.npmjs.com/package/bigint-isqrt?activeTab=code
    if (value < 2n) {
      return value;
    }
    if (value < 16n) {
      return BigInt(Math.sqrt(Number(value)) | 0);
    }
    let x0, x1;
    if (value < 4503599627370496n) {//1n<<52n
      x1 = BigInt(Math.sqrt(Number(value)) | 0) - 3n;
    } else {
      let vlen = value.toString().length;
      if (!(vlen & 1)) {
        x1 = 10n ** (BigInt(vlen / 2));
      } else {
        x1 = 4n * 10n ** (BigInt((vlen / 2) | 0));
      }
    }
    do {
      x0 = x1;
      x1 = ((value / x0) + x0) >> 1n;
    } while ((x0 !== x1 && x0 !== (x1 - 1n)));
    return x0;
  }
  static allBalancedParentheses(input) {

  }
}


/** @param {NS} ns */
export async function main(ns) {

/*
  let s = "sigma-cosmetics";
  let f = "contract-964134.cct";
  let type = ns.codingcontract.getContractType(f, s);
  ns.tprint(ns.codingcontract.getDescription(f, s));
  ns.tprint(typeof ns.codingcontract.getData(f, s));
  ns.tprint(ContractSolver.canSolve(type));
  ns.tprint(ns.codingcontract.getNumTriesRemaining(f, s));

  let inputs = ["()())()", ")()(a(())(", "(a)())()", "))))a((((", "(((", "a()b"];
  for (let input of inputs) {
    let answer = [];
    let open = 0, pairs = 0, left = 0;
    for (let i = 0; i < input.length; i++) {
      switch (input[i]) {
        case '(': open++; break;
        case ')': if (open > pairs) pairs++; break;
      }
    }
    ns.tprint(pairs);

  }


  /* */


  const servers = list_servers(ns).filter(s => s.indexOf("home-") < 0);
  for (const s of servers) {
    const contracts = ns.ls(s).filter(s => s.indexOf(".cct") > 0);
    for (const f of contracts) {
      const type = ns.codingcontract.getContractType(f, s);
      if (ContractSolver.canSolve(type)) {
        ns.tprint(`${s} ${f} ${type}`);
        let answer = ContractSolver.solve(type, ns.codingcontract.getData(f, s));
        ns.tprint(ns.codingcontract.attempt(answer, f, s));
      }
    }
  }
}