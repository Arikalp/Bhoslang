function tokenize(input) {
  const tokens = [];

  // 🔥 master regex for tokens (updated to include strings)
  const regex =
    /"([^"\\]|\\.)*"|\b(bsdk|badalbsdk|likhbsdk|batabsdk|madadbsdk|agarbsdk|nahitohbsdk)\b|\d+|[a-zA-Z_][a-zA-Z0-9_]*|[+\-*/=<>!]+/g;

  const matches = input.match(regex) || [];

  for (let word of matches) {
    // ===== strings =====
    if (word.startsWith('"') && word.endsWith('"')) {
      tokens.push({ type: "STRING", value: word.slice(1, -1) });
    }
    // ===== keywords =====
    else if (word === "bsdk") tokens.push({ type: "DECLARE" });
    else if (word === "badalbsdk") tokens.push({ type: "UPDATE" });
    else if (word === "likhbsdk") tokens.push({ type: "PRINT_VAR" });
    else if (word === "batabsdk") tokens.push({ type: "PRINT_EXPR" });
    
    //help
    else if (word === "madadbsdk") tokens.push({ type: "HELP" });
    else if (word === "agarbsdk") tokens.push({ type: "IF" });
    else if (word === "nahitohbsdk") tokens.push({ type: "ELSE" });

    // ===== operators =====
    else if (word === "=") tokens.push({ type: "EQUALS" });
    else if (word === "+") tokens.push({ type: "PLUS" });
    else if (word === "-") tokens.push({ type: "MINUS" });
    else if (word === "*") tokens.push({ type: "MULTIPLY" });
    else if (word === "/") tokens.push({ type: "DIVIDE" });
    else if (word === "==") tokens.push({ type: "EQUAL_EQUAL" });
    else if (word === "!=") tokens.push({ type: "NOT_EQUAL" });
    else if (word === ">") tokens.push({ type: "GREATER" });
    else if (word === "<") tokens.push({ type: "LESS" });
    else if (word === ">=") tokens.push({ type: "GREATER_EQUAL" });
    else if (word === "<=") tokens.push({ type: "LESS_EQUAL" });

    // ===== numbers =====
    else if (/^\d+$/.test(word)) {
      tokens.push({ type: "NUMBER", value: Number(word) });
    }

    // ===== identifiers =====
    else {
      tokens.push({ type: "IDENTIFIER", value: word });
    }
  }

  return tokens;
}

module.exports = tokenize;
