function parse(tokens) {
  let i = 0;
  const ast = [];

  function parseExpression(left, operator, right) {
    return {
      type: "BinaryExpression",
      operator: operator.type,
      left,
      right,
    };
  }

  while (i < tokens.length) {
    const token = tokens[i];

    // bsdk x = 10
    if (token.type === "DECLARE") {
      const name = tokens[i + 1].value;
      const value = tokens[i + 3];

      ast.push({
        type: "VariableDeclaration",
        name,
        value,
      });

      i += 4;
    }

    // badalbsdk x = expr
    else if (token.type === "UPDATE") {
      const name = tokens[i + 1].value;

      const left = tokens[i + 3];
      const operator = tokens[i + 4];
      const right = tokens[i + 5];

      let expression;

      if (operator && operator.type.endsWith("PLUS") === false) {
        // simple assignment
        expression = left;
        i += 4;
      } else {
        expression = parseExpression(left, operator, right);
        i += 6;
      }

      ast.push({
        type: "VariableUpdate",
        name,
        expression,
      });
    }

    // likhbsdk x
    else if (token.type === "PRINT_VAR") {
      ast.push({
        type: "PrintVariable",
        name: tokens[i + 1].value,
      });

      i += 2;
    }

    // batabsdk x + y
    else if (token.type === "PRINT_EXPR") {
      const left = tokens[i + 1];
      const operator = tokens[i + 2];
      const right = tokens[i + 3];

      ast.push({
        type: "PrintExpression",
        expression: parseExpression(left, operator, right),
      });

      i += 4;
    } else {
      i++;
    }
  }

  return ast;
}

module.exports = parse;
