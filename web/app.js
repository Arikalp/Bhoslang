// ================= MEMORY =================
const memory = {};
const history = [];
let historyIndex = -1;

// ================= TOKENIZER =================
function tokenize(input) {
  const tokens = [];
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
    else if (word === "madadbsdk") tokens.push({ type: "HELP" });
    else if (word === "agarbsdk") tokens.push({ type: "IF" });
    else if (word === "nahitohbsdk") tokens.push({ type: "ELSE" });
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
  if (token.type === "STRING") return token.value;
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

// ================= PARSER =================
function parse(tokens) {
  let i = 0;
  const ast = [];

  function bin(left, op, right) {
    return { type: "BinaryExpression", operator: op.type, left, right };
  }

  function comp(left, op, right) {
    return { type: "ComparisonExpression", operator: op.type, left, right };
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

    else if (t.type === "HELP") {
      ast.push({ type: "HelpCommand" });
      i += 1;
    }

    else if (t.type === "IF") {
      // Parse: agarbsdk condition
      const condition = comp(tokens[i + 1], tokens[i + 2], tokens[i + 3]);
      i += 4;
      
      const ifBlock = [];
      
      // Parse if block until we find ELSE or end
      while (i < tokens.length && tokens[i].type !== "ELSE") {
        // Simple statement parsing for if block
        if (tokens[i].type === "DECLARE") {
          ifBlock.push({
            type: "VariableDeclaration",
            name: tokens[i + 1].value,
            value: tokens[i + 3],
          });
          i += 4;
        } else if (tokens[i].type === "PRINT_VAR") {
          ifBlock.push({ type: "PrintVariable", name: tokens[i + 1].value });
          i += 2;
        } else if (tokens[i].type === "PRINT_EXPR") {
          ifBlock.push({
            type: "PrintExpression",
            expression: bin(tokens[i + 1], tokens[i + 2], tokens[i + 3]),
          });
          i += 4;
        } else if (tokens[i].type === "UPDATE") {
          const name = tokens[i + 1].value;
          const left = tokens[i + 3];
          const op = tokens[i + 4];
          const right = tokens[i + 5];

          let expr;
          if (op && ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"].includes(op.type)) {
            expr = bin(left, op, right);
            i += 6;
          } else {
            expr = left;
            i += 4;
          }
          ifBlock.push({ type: "VariableUpdate", name, expression: expr });
        } else {
          i++; // Skip unknown token
        }
      }

      const elseBlock = [];
      
      // Parse else block if present
      if (i < tokens.length && tokens[i].type === "ELSE") {
        i += 1; // Skip ELSE token
        
        while (i < tokens.length) {
          // Simple statement parsing for else block
          if (tokens[i].type === "DECLARE") {
            elseBlock.push({
              type: "VariableDeclaration",
              name: tokens[i + 1].value,
              value: tokens[i + 3],
            });
            i += 4;
          } else if (tokens[i].type === "PRINT_VAR") {
            elseBlock.push({ type: "PrintVariable", name: tokens[i + 1].value });
            i += 2;
          } else if (tokens[i].type === "PRINT_EXPR") {
            elseBlock.push({
              type: "PrintExpression",
              expression: bin(tokens[i + 1], tokens[i + 2], tokens[i + 3]),
            });
            i += 4;
          } else if (tokens[i].type === "UPDATE") {
            const name = tokens[i + 1].value;
            const left = tokens[i + 3];
            const op = tokens[i + 4];
            const right = tokens[i + 5];

            let expr;
            if (op && ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"].includes(op.type)) {
              expr = bin(left, op, right);
              i += 6;
            } else {
              expr = left;
              i += 4;
            }
            elseBlock.push({ type: "VariableUpdate", name, expression: expr });
          } else {
            i++; // Skip unknown token
          }
        }
      }

      ast.push({
        type: "IfStatement",
        condition,
        ifBlock,
        elseBlock,
      });
    }

    else if (t.type === "UPDATE") {
      const name = tokens[i + 1].value;
      const left = tokens[i + 3];
      const op = tokens[i + 4];
      const right = tokens[i + 5];

      let expr;

      if (op && ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"].includes(op.type)) {
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
const terminalInput = document.getElementById("terminal-input");
const output = document.getElementById("output");

function printLine(text, type = 'default') {
  const div = document.createElement("div");
  div.className = "line";
  
  // Convert to string for consistent handling
  const textStr = String(text);
  
  // Add specific styling classes based on content
  if (textStr.includes('bhoslang >>')) {
    div.innerHTML = `<span class="prompt">${textStr}</span>`;
  } else if (textStr.includes('📜') || textStr.includes('->')) {
    div.className += ' help-text';
    div.textContent = textStr;
  } else if (textStr.includes('❌') || textStr.includes('Error')) {
    div.className += ' error';
    div.textContent = textStr;
  } else if (textStr.includes('🔥') || textStr.includes('👋')) {
    div.className += ' success';
    div.textContent = textStr;
  } else if (typeof text === 'number') {
    div.className += ' success';
    div.textContent = textStr;
  } else {
    div.textContent = textStr;
  }
  
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function printCommand(command) {
  const commandDiv = document.createElement("div");
  commandDiv.className = "command-line";
  
  const promptSpan = document.createElement("span");
  promptSpan.className = "prompt";
  promptSpan.textContent = "bhoslang >> ";
  
  const commandSpan = document.createElement("span");
  commandSpan.className = "command-text";
  commandSpan.textContent = command;
  
  commandDiv.appendChild(promptSpan);
  commandDiv.appendChild(commandSpan);
  
  output.appendChild(commandDiv);
  output.scrollTop = output.scrollHeight;
}

function executeCommand(command) {
  if (!command.trim()) return;

  // Add to history
  history.push(command);
  historyIndex = history.length;

  // Show the command in the output
  printCommand(command);

  try {
    const tokens = tokenize(command);
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
            printLine(memory[blockNode.name]);

          if (blockNode.type === "PrintExpression")
            printLine(evalBinary(blockNode.expression));
        }
      }

      if (node.type === "HelpCommand") {
        printLine("📜 Available Commands:");
        printLine("bsdk          -> declare variable");
        printLine("badalbsdk     -> update variable");
        printLine("likhbsdk      -> print variable");
        printLine("batabsdk      -> print expression");
        printLine("agarbsdk      -> if statement");
        printLine("nahitohbsdk   -> else statement");
        printLine("madadbsdk     -> show help");
      }
    }
  } catch (err) {
    printLine("❌ Error: " + err.message);
  }
}

// ================= KEY HANDLING =================
terminalInput.addEventListener("keydown", (e) => {
  // ENTER → execute command
  if (e.key === "Enter") {
    e.preventDefault();
    
    const command = terminalInput.value.trim();
    if (command) {
      executeCommand(command);
      terminalInput.value = "";
    }
  }

  // ↑ history navigation
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = history[historyIndex];
    }
  }

  // ↓ history navigation
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      terminalInput.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      terminalInput.value = "";
    }
  }

  // TAB → simple completion (could be expanded)
  if (e.key === "Tab") {
    e.preventDefault();
    const current = terminalInput.value;
    const commands = ["bsdk", "badalbsdk", "likhbsdk", "batabsdk", "madadbsdk", "agarbsdk", "nahitohbsdk"];
    
    for (const cmd of commands) {
      if (cmd.startsWith(current)) {
        terminalInput.value = cmd;
        break;
      }
    }
  }
});

// Focus input when clicking anywhere in terminal
document.querySelector('.terminal-content').addEventListener('click', () => {
  terminalInput.focus();
});

// Auto-focus on load
terminalInput.focus();
