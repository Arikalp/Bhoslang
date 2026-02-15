# 🚀 Bhoslang Language — Phase 1 Documentation

Welcome to **Bhoslang Language** — a fun, beginner-friendly custom programming language.
This document explains all available commands, syntax, and examples for Phase 1.

---

# 📌 Overview

Bhoslang Language currently supports:

* Variable declaration
* Variable update
* Printing variables
* Printing expressions
* Basic arithmetic operations

✅ Beginner friendly
✅ Whitespace based
✅ Interpreted language

---

# 🧠 Basic Syntax Rules

* Each statement is written on a new line.
* Keywords are **case-sensitive**.
* Spaces between tokens are required.
* Variables are created using `bsdk`.

---

# 🔥 Commands Reference

---

## 🟢 1. Variable Declaration — `bsdk`

### ✅ Syntax

```
bsdk <variable> = <value>
```

### ✅ Description

Creates a new variable and assigns a value.

### ✅ Example

```
bsdk x = 10
bsdk y = 5
```

---

## 🟡 2. Variable Update — `badalbsdk`

### ✅ Syntax

```
badalbsdk <variable> = <expression>
```

### ✅ Description

Updates the value of an existing variable.

### ✅ Examples

```
badalbsdk x = 20
badalbsdk x = x + y
badalbsdk y = y * 2
```

---

## 🔵 3. Print Variable — `likhbsdk`

### ✅ Syntax

```
likhbsdk <variable>
```

### ✅ Description

Prints the value of a variable to the console.

### ✅ Example

```
likhbsdk x
```

### ✅ Output

```
10
```

---

## 🟣 4. Print Expression — `batabsdk`

### ✅ Syntax

```
batabsdk <value> <operator> <value>
```

### ✅ Description

Evaluates and prints a mathematical expression.

### ✅ Examples

```
batabsdk x + y
batabsdk x * y
batabsdk 10 - 3
```

---

# 🧮 Supported Operators

| Operator | Meaning        | Example |
| -------- | -------------- | ------- |
| `+`      | Addition       | `x + y` |
| `-`      | Subtraction    | `x - y` |
| `*`      | Multiplication | `x * y` |
| `/`      | Division       | `x / y` |

---

# 📄 Sample Program

```
bsdk x = 10
bsdk y = 5

likhbsdk x
batabsdk x + y
batabsdk x * y

badalbsdk x = x + y
likhbsdk x
```

---

# ▶️ Expected Output

```
10
15
50
15
```

---

# ⚠️ Current Limitations (Phase 1)

* No strings support
* No parentheses in expressions
* No if/else
* No loops
* No error handling for undefined variables
* Expressions support only binary operations

---

# 🛣️ Roadmap (Planned Features)

Future versions may include:

* 🔹 Strings support
* 🔹 Conditionals (`agarbsdk`, `warna`)
* 🔹 Loops (`jabtakbsdk`)
* 🔹 Functions
* 🔹 Better error messages
* 🔹 VS Code syntax highlighting

---

# 🤝 Contributing

Feel free to:

* Improve tokenizer
* Add new commands
* Optimize parser
* Enhance interpreter

---

# 🧑‍💻 Author

Built with ❤️ by Sankalp.

---

**Happy Coding! 🚀**
