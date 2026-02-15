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

    // =============================
    // bsdk x = 10
    // =============================
    if (token.type === "DECLARE") {
      const name = tokens[i + 1].value;
      const valueToken = tokens[i + 3];

      ast.push({
        type: "VariableDeclaration",
        name,
        value: valueToken,
      });

      i += 4;
    }

    // =============================
    // badalbsdk x = ...
    // =============================
    else if (token.type === "UPDATE") {
      const name = tokens[i + 1].value;

      const left = tokens[i + 3];
      const operator = tokens[i + 4];
      const right = tokens[i + 5];

      let expression;

      // 🔥 CASE 1: simple assignment
      if (
        !operator ||
        !["PLUS", "MINUS", "MULTIPLY", "DIVIDE"].includes(operator.type)
      ) {
        expression = left;
        i += 4;
      }
      // 🔥 CASE 2: binary expression
      else {
        expression = parseExpression(left, operator, right);
        i += 6;
      }

      ast.push({
        type: "VariableUpdate",
        name,
        expression,
      });
    }

    // =============================
    // likhbsdk x
    // =============================
    else if (token.type === "PRINT_VAR") {
      ast.push({
        type: "PrintVariable",
        name: tokens[i + 1].value,
      });

      i += 2;
    }

    // =============================
    // batabsdk x + y
    // =============================
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
