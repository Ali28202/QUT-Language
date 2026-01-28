# QUT Language Interpreter

A simple **TypeScript-based interpreter** for the **QUT programming language**.
This project compiles TypeScript to JavaScript and executes `.qut` source files using Node.js, simulating a tape-based execution model.

---

## 📦 Features

- Written in **TypeScript**
- Compiles to JavaScript using `tsc`
- Executes `.qut` source files via Node.js
- Displays:

  - Program output
  - Memory tape state
  - Register value
  - Instruction pointer position

---

## 🛠️ Requirements

- **Node.js** (v14+ recommended)
- **TypeScript** (`tsc`)

Install TypeScript globally if needed:

```bash
npm install -g typescript
```

---

## 🚀 Usage

### 1. Compile the project

```bash
tsc project.ts
```

This will generate `project.js`.

### 2. Run a QUT program

```bash
node ./project.js ./Sample\ Codes/loop.qut
```

---

## 📄 Example Output

```
B
------------
Tape: Uint8Array(100) [
  0, 0, 66, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ...
]
Register: 0
Pointer: 2
------------
```

### Output Explanation

- **Tape**: A fixed-size `Uint8Array` representing program memory
- **Register**: Current register value
- **Pointer**: Current tape pointer position
- **Program Output**: Printed characters (e.g., `B`)

---

## 📁 Project Structure

```
.
├── project.ts
├── package.json
├── package-lock.json
├── .gitignore
├── Sample Codes/
│   ├── loop.qut
│   └── ...
└── README.md
```

---

## 🧠 Notes

- The tape size is fixed (default: 100 cells)
- Each cell stores an unsigned 8-bit value
- Intended for educational and experimental purposes
