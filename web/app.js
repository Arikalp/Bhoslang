// ================= MEMORY =================
const memory = {};
const history = [];
let historyIndex = -1;

// ================= TOKENIZER =================
function tokenize(input) {
  const tokens = [];
  const regex =
    /\b(bsdk|badalbsdk|likhbsdk|batabsdk)\b|\d+|[a-zA-Z_][a-zA-Z0-9_]*|[+\-*/=]/g;

  const matches = input.match(regex) || [];

  for (let word of matches) {
    if (word === "bsdk") tokens.push({ type: "DECLARE" });
    else if (word === "badalbsdk") tokens.push({ type: "UPDATE" });
    else if (word === "likhbsdk") tokens.push({ type: "PRINT_VAR" });
    else if (word === "batabsdk") tokens.push({ type: "PRINT_EXPR" });
    else if (word === "=") tokens.push({ type: "EQUALS" });
    else if (word === "+") tokens.push({ type: "PLUS" });
    else if (word === "-") tokens.push({ type: "MINUS" });
    else if (word === "*") tokens.push({ type: "MULTIPLY" });
    else if (word === "/") tokens.push({ type: "DIVIDE" });
    else if (/^\d+$/.test(word))
      tokens.push({ type: "NUMBER", value: Number(word) });
    else tokens.push({ type: "IDENTIFIER", value: word });
  }

  return tokens;
}

// ================= INTERPRETER HELPERS =================
function getValue(token) {
  if (!token) return 0;
  if (token.type === "NUMBER") return token.value;
  if (token.type === "IDENTIFIER") return memory[token.value] ?? 0;
  return 0;
}

function evalBinary(expr) {
  const left = getValue(expr.left);
  const right = getValue(expr.right);

  switch (expr.operator) {
    case "PLUS": return left + right;
    case "MINUS": return left - right;
    case "MULTIPLY": return left * right;
    case "DIVIDE": return left / right;
    default: return 0;
  }
}

// ================= PARSER =================
function parse(tokens) {
  let i = 0;
  const ast = [];

  function bin(left, op, right) {
    return { type: "BinaryExpression", operator: op.type, left, right };
  }

  while (i < tokens.length) {
    const t = tokens[i];

    if (t.type === "DECLARE") {
      ast.push({
        type: "VariableDeclaration",
        name: tokens[i + 1].value,
        value: tokens[i + 3],
      });
      i += 4;
    }

    else if (t.type === "PRINT_VAR") {
      ast.push({ type: "PrintVariable", name: tokens[i + 1].value });
      i += 2;
    }

    else if (t.type === "PRINT_EXPR") {
      ast.push({
        type: "PrintExpression",
        expression: bin(tokens[i + 1], tokens[i + 2], tokens[i + 3]),
      });
      i += 4;
    }

    else if (t.type === "UPDATE") {
      const name = tokens[i + 1].value;
      const left = tokens[i + 3];
      const op = tokens[i + 4];
      const right = tokens[i + 5];

      let expr;

      if (op && ["PLUS","MINUS","MULTIPLY","DIVIDE"].includes(op.type)) {
        expr = bin(left, op, right);
        i += 6;
      } else {
        expr = left;
        i += 4;
      }

      ast.push({ type: "VariableUpdate", name, expression: expr });
    } else i++;
  }

  return ast;
}

// ================= UI =================
const editor = document.getElementById("editor");
const output = document.getElementById("output");

function printLine(text) {
  const div = document.createElement("div");
  div.className = "line";
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function runCode(code) {
  printLine("bhoslang >> " + code);

  const lines = code.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    const tokens = tokenize(line);
    const ast = parse(tokens);

    for (const node of ast) {
      if (node.type === "VariableDeclaration")
        memory[node.name] = getValue(node.value);

      if (node.type === "VariableUpdate")
        memory[node.name] =
          node.expression.type === "BinaryExpression"
            ? evalBinary(node.expression)
            : getValue(node.expression);

      if (node.type === "PrintVariable")
        printLine(memory[node.name]);

      if (node.type === "PrintExpression")
        printLine(evalBinary(node.expression));
    }
  }
}

// ================= KEY HANDLING =================
editor.addEventListener("keydown", (e) => {
  // ENTER → run
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    const code = editor.value.trim();
    if (!code) return;

    history.push(code);
    historyIndex = history.length;

    try {
      runCode(code);
    } catch (err) {
      printLine("❌ Error: " + err.message);
    }

    editor.value = "";
  }

  // ↑ history
  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      editor.value = history[historyIndex];
    }
  }

  // ↓ history
  if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      editor.value = history[historyIndex];
    } else {
      editor.value = "";
    }
  }
});
