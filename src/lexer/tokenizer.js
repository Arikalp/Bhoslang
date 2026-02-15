function tokenize(input) {
  const tokens = [];

  // 🔥 master regex for tokens
  const regex =
    /\b(bsdk|badalbsdk|likhbsdk|batabsdk)\b|\d+|[a-zA-Z_][a-zA-Z0-9_]*|[+\-*/=]/g;

  const matches = input.match(regex) || [];

  for (let word of matches) {
    // ===== keywords =====
    if (word === "bsdk") tokens.push({ type: "DECLARE" });
    else if (word === "badalbsdk") tokens.push({ type: "UPDATE" });
    else if (word === "likhbsdk") tokens.push({ type: "PRINT_VAR" });
    else if (word === "batabsdk") tokens.push({ type: "PRINT_EXPR" });

    // ===== operators =====
    else if (word === "=") tokens.push({ type: "EQUALS" });
    else if (word === "+") tokens.push({ type: "PLUS" });
    else if (word === "-") tokens.push({ type: "MINUS" });
    else if (word === "*") tokens.push({ type: "MULTIPLY" });
    else if (word === "/") tokens.push({ type: "DIVIDE" });

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
