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

  function parseComparison(left, operator, right) {
    return {
      type: "ComparisonExpression",
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
    } 
    
    // =============================
    // agarbsdk condition
    // =============================
    else if (token.type === "IF") {
      // Parse: agarbsdk condition
      const condition = parseComparison(tokens[i + 1], tokens[i + 2], tokens[i + 3]);
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
            expression: parseExpression(tokens[i + 1], tokens[i + 2], tokens[i + 3]),
          });
          i += 4;
        } else if (tokens[i].type === "UPDATE") {
          const name = tokens[i + 1].value;
          const left = tokens[i + 3];
          const op = tokens[i + 4];
          const right = tokens[i + 5];

          let expr;
          if (op && ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"].includes(op.type)) {
            expr = parseExpression(left, op, right);
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
              expression: parseExpression(tokens[i + 1], tokens[i + 2], tokens[i + 3]),
            });
            i += 4;
          } else if (tokens[i].type === "UPDATE") {
            const name = tokens[i + 1].value;
            const left = tokens[i + 3];
            const op = tokens[i + 4];
            const right = tokens[i + 5];

            let expr;
            if (op && ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"].includes(op.type)) {
              expr = parseExpression(left, op, right);
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
    
    else if (token.type === "HELP") {
      ast.push({
        type: "HelpCommand",
      });
      i += 1;
    }

    else {
      i++;
    }
  }

  return ast;
}

module.exports = parse;
