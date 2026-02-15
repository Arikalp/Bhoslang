function interpret(ast) {
  const memory = {};

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
      console.log(memory[node.name]);
    }

    if (node.type === "PrintExpression") {
      console.log(evalBinary(node.expression));
    }
  }
}

module.exports = interpret;
