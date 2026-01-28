import * as fs from "fs";
import * as readline from "readline";

let i: number = 0;

async function main(): Promise<void> {
  let tape: Uint8Array = new Uint8Array(100).fill(0);
  let register: Uint8Array = new Uint8Array(1).fill(0);
  let pointer: Uint8Array = new Uint8Array(1).fill(0);
  let dictionary: Map<number, number> = new Map();

  const args = process.argv.slice(2);
  if (args.length != 1) {
    if (args.length < 1) console.log("\nERROR: No file path provided.");
    if (args.length >= 2) console.log("\nERROR: Extra arguments provided.");
    console.log("Usage: node project.js <file-path>");
    process.exit(1);
  }
  const filePath = args[0];
  const instructions: String[] = readFile(filePath);

  for (i = 0; i < instructions.length; i++) {
    if (instructions[i] === "QUT") {
      const matchIndex = matchingBrackets(instructions, i);
      if (matchIndex !== -1) {
        dictionary.set(i, matchIndex);
        dictionary.set(matchIndex, i);
      } else {
        console.log(`\nERROR: No matching bracket for instruction(QUT): ${i}`);
        process.exit(1);
      }
    }
  }

  for (i = 0; i < instructions.length; i++) {
    await executeInstructions(
      instructions[i],
      tape,
      pointer,
      register,
      dictionary
    );
  }

  console.log("\n------------");
  console.log("Tape:", tape);
  console.log("Register:", register[0]);
  console.log("Pointer:", pointer[0]);
  console.log("------------");
}

function readFile(filePath: string): String[] {
  const data = fs.readFileSync(filePath, "utf-8");
  const words = data.replace(/\s+/g, " ").trim().split(" ");
  return words;
}

function readCharFromInput(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter Your Character: ", (input) => {
      rl.close();
      resolve(input);
    });
  });
}

async function executeInstructions(
  instruction: String,
  tape: Uint8Array,
  pointer: Uint8Array,
  register: Uint8Array,
  dictionary: Map<number, number>
): Promise<void> {
  switch (instruction) {
    case "qut": {
      const jumpIndex = dictionary.get(i);
      if (jumpIndex !== undefined) {
        i = jumpIndex - 1;
      } else {
        console.log(`\nERROR: No matching bracket for instruction(qut): ${i}`);
        process.exit(1);
      }
      break;
    }
    case "qUt":
      pointer[0] = (pointer[0] - 1 + tape.length) % tape.length;
      break;
    case "quT":
      pointer[0] = (pointer[0] + 1) % tape.length;
      break;
    case "qUT": {
      const instructionValue = getInstruction(tape[pointer[0]]);
      if (instructionValue === "") {
        console.log(`\nERROR: Invalid instruction code: ${tape[pointer[0]]}`);
        process.exit(1);
      }
      await executeInstructions(
        instructionValue,
        tape,
        pointer,
        register,
        dictionary
      );
      break;
    }
    case "Qut": {
      if (tape[pointer[0]] == 0) {
        const input = await readCharFromInput();
        if (input.length > 0) {
          const firstChar = input.charAt(0);
          tape[pointer[0]] = firstChar.charCodeAt(0);
        } else {
          if (input.length == 0) {
            console.log(`\nERROR: Entered input is empty.`);
          }
          process.exit(1);
        }
      } else {
        process.stdout.write(String.fromCharCode(tape[pointer[0]]));
      }
      break;
    }
    case "QUt": {
      if (tape[pointer[0]] === 0) {
        console.log("\nOverflow detected.");
      }
      tape[pointer[0]]--;
      break;
    }
    case "QuT": {
      tape[pointer[0]]++;
      if (tape[pointer[0]] === 0) {
        console.log("\nOverflow detected.");
      }
      break;
    }
    case "QUT": {
      if (tape[pointer[0]] == 0) {
        const jumpIndex = dictionary.get(i);
        if (jumpIndex !== undefined) {
          i = jumpIndex;
        }
      }
      break;
    }
    case "UUU":
      tape[pointer[0]] = 0;
      break;
    case "QQQ": {
      if (register[0] == 0) {
        register[0] = tape[pointer[0]];
      } else {
        tape[pointer[0]] = register[0];
        register[0] = 0;
      }
      break;
    }
    case "TUQ": {
      process.stdout.write(String.fromCharCode(tape[pointer[0]]));
      break;
    }
    case "Tuq": {
      const input = await readCharFromInput();
      if (input.length > 0) {
        const firstChar = input.charAt(0);
        tape[pointer[0]] = firstChar.charCodeAt(0);
      } else {
        if (input.length == 0) {
          console.log(`\nERROR: Entered input is empty.`);
        }
        process.exit(1);
      }
      break;
    }
    default:
      console.log(`\nERROR: Invalid instruction: ${instruction}`);
      process.exit(1);
  }
}

function getInstruction(instructionCode: number): String {
  return (
    {
      0: "qut",
      1: "qUt",
      2: "quT",
      4: "Qut",
      5: "QUt",
      6: "QuT",
      7: "QUT",
      8: "UUU",
      9: "QQQ",
      10: "TUQ",
      11: "Tuq",
    }[instructionCode] ?? ""
  );
}

function matchingBrackets(instructions: String[], startIndex: number): number {
  let stack: number[] = [];
  for (let i = startIndex; i < instructions.length; i++) {
    if (instructions[i] === "QUT") {
      stack.push(i);
    } else if (instructions[i] === "qut") {
      stack.pop();
      if (stack.length === 0) {
        return i;
      }
    }
  }
  return -1;
}

main();
