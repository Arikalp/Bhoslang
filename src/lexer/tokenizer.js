function tokenize(input) {
  const tokens = [];
  const words = input.split(/\s+/).filter(Boolean);

  for (let word of words) {
    if (word === "bsdk") tokens.push({ type: "DECLARE" });
    else if (word === "badalbsdk") tokens.push({ type: "UPDATE" });
    else if (word === "likhbsdk") tokens.push({ type: "PRINT_VAR" });
    else if (word === "batabsdk") tokens.push({ type: "PRINT_EXPR" });

    else if (word === "=") tokens.push({ type: "EQUALS" });

    else if (word === "+") tokens.push({ type: "PLUS" });
    else if (word === "-") tokens.push({ type: "MINUS" });
    else if (word === "*") tokens.push({ type: "MULTIPLY" });
    else if (word === "/") tokens.push({ type: "DIVIDE" });

    else if (!isNaN(word))
      tokens.push({ type: "NUMBER", value: Number(word) });

    else tokens.push({ type: "IDENTIFIER", value: word });
  }

  return tokens;
}

module.exports = tokenize;
