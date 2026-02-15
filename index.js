const fs = require("fs");
const tokenize = require("./src/lexer/tokenizer");
const parse = require("./src/parser/parser");
const interpret = require("./src/interpreter/interpreter");

const code = fs.readFileSync("./examples/sample.bsdk", "utf-8");

const tokens = tokenize(code);
const ast = parse(tokens);
interpret(ast);
