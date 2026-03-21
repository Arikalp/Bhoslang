const readline = require("readline");
const tokenize = require("./src/lexer/tokenizer");
const parse = require("./src/parser/parser");

// 🎨 ANSI colors (no extra libs needed)
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

// 🔥 persistent memory
const memory = {};

// ===== Interpreter helpers =====

function getValue(token) {
  if (!token) return 0;
  if (token.type === "NUMBER") return token.value;
  if (token.type === "STRING") return token.value;
  if (token.type === "IDENTIFIER") return memory[token.value] ?? 0;
  return 0;
}

function evalBinary(expr) {
  const left = getValue(expr.left);
  const right = getValue(expr.right);

  switch (expr.operator) {
    case "PLUS":
      return left + right;
    case "MINUS":
      return left - right;
    case "MULTIPLY":
      return left * right;
    case "DIVIDE":
      return left / right;
    default:
      return 0;
  }
}

function evalComparison(left, operator, right) {
  const leftVal = getValue(left);
  const rightVal = getValue(right);

  switch (operator) {
    case "EQUAL_EQUAL": return leftVal === rightVal;
    case "NOT_EQUAL": return leftVal !== rightVal;
    case "GREATER": return leftVal > rightVal;
    case "LESS": return leftVal < rightVal;
    case "GREATER_EQUAL": return leftVal >= rightVal;
    case "LESS_EQUAL": return leftVal <= rightVal;
    default: return false;
  }
}

function interpretLine(ast) {
  for (const node of ast) {
    if (node.type === "VariableDeclaration") {
      memory[node.name] = getValue(node.value);
    }

    if (node.type === "VariableUpdate") {
      if (node.expression.type === "BinaryExpression") {
        memory[node.name] = evalBinary(node.expression);
      } else {
        memory[node.name] = getValue(node.expression);
      }
    }

    if (node.type === "PrintVariable") {
      console.log(colors.green + memory[node.name] + colors.reset);
    }

    if (node.type === "PrintExpression") {
      console.log(colors.green + evalBinary(node.expression) + colors.reset);
    }

    if (node.type === "IfStatement") {
      const conditionResult = evalComparison(
        node.condition.left,
        node.condition.operator,
        node.condition.right
      );

      const blockToExecute = conditionResult ? node.ifBlock : node.elseBlock;

      // Execute the chosen block
      for (const blockNode of blockToExecute) {
        if (blockNode.type === "VariableDeclaration")
          memory[blockNode.name] = getValue(blockNode.value);

        if (blockNode.type === "VariableUpdate")
          memory[blockNode.name] =
            blockNode.expression.type === "BinaryExpression"
              ? evalBinary(blockNode.expression)
              : getValue(blockNode.expression);

        if (blockNode.type === "PrintVariable")
          console.log(colors.green + memory[blockNode.name] + colors.reset);

        if (blockNode.type === "PrintExpression")
          console.log(colors.green + evalBinary(blockNode.expression) + colors.reset);
      }
    }

    if (node.type === "HelpCommand") {
      console.log(colors.magenta + "📜 Available Commands:");
      console.log(colors.yellow + "bsdk          -> declare variable");
      console.log(colors.yellow + "badalbsdk     -> update variable");
      console.log(colors.yellow + "likhbsdk      -> print variable");
      console.log(colors.yellow + "batabsdk      -> print expression");
      console.log(colors.yellow + "agarbsdk      -> if statement");
      console.log(colors.yellow + "nahitohbsdk   -> else statement");
      console.log(colors.yellow + "madadbsdk     -> show help" + colors.reset);
    }
  }
}

// ===== REPL Setup =====

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colors.cyan + "bhoslang >> " + colors.reset,
  historySize: 1000, // 🔥 command history buffer
});

console.log(
  colors.magenta +
    "🔥 Welcome to Bhoslang REPL (Pro Edition)\n" +
    colors.reset
);
console.log(colors.yellow + "Type 'exit' to quit.\n" + colors.reset);

rl.prompt();

rl.on("line", (line) => {
  const input = line.trim();

  if (input === "exit") {
    rl.close();
    return;
  }

  if (input === "") {
    rl.prompt();
    return;
  }

  try {
    const tokens = tokenize(input);
    const ast = parse(tokens);
    interpretLine(ast);
  } catch (err) {
    console.log(colors.red + "❌ Bhoslang Error: " + err.message + colors.reset);
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log(colors.magenta + "\n👋 Exiting Bhoslang. Stay legendary." + colors.reset);
  process.exit(0);
});
