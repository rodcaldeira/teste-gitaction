const argv = require("process").argv;
const fs = require("fs");

let pathToDicts = "../../src/assets/i18n";
let dicts = [];

argv.forEach((arg, index) => {
  if (arg == "--path" || arg == "-p") {
    pathToDicts = argv[index + 1];
  }
  if (arg == "--languages" || arg == "-l") {
    dicts = argv[index + 1].split(",");
  }
  if (arg == "--help" || arg == "-h" || argv.length <= 2) {
    console.log(
      "Usage: node compareDicts.js --path <path to dicts> --languages <languages to compare>"
    );
    console.log(
      "Example: node compareDicts.js --path ../../src/assets/i18n --languages en,es"
    );
    process.exit(0);
  }
});

let hasFailed = false;

let dictKeysSorted = [];

dicts.forEach((dict) => {
  const loadedDictJson = JSON.parse(
    fs.readFileSync(pathToDicts + "/" + dict + ".json", "utf8")
  );
  const jsonKeys = Object.keys(loadedDictJson);

  dictKeysSorted.push({
    name: dict,
    keys: jsonKeys,
    length: jsonKeys.length,
  });
});

dictKeysSorted.forEach((challengeDict) => {
  dictKeysSorted.forEach((missingKeyDict) => {
    if (challengeDict.name !== missingKeyDict.name) {
      let missingKeys = [];
      // console.log(
      //   `Searching missing keys in... ${missingKeyDict.name.toUpperCase()} from ${challengeDict.name.toUpperCase()}`
      // );
      challengeDict.keys.forEach((key) => {
        if (!missingKeyDict.keys.includes(key)) {
          missingKeys.push(key);
        }
      });
      if (missingKeys.length > 0) {
        hasFailed = true;
        console.error(
          `Searching missing keys in... ${missingKeyDict.name.toUpperCase()} from ${challengeDict.name.toUpperCase()}\n
            Were found ${missingKeys.length} missing keys.
            ${missingKeys.join(", ")}\n\n`
        );
      }
      // if (missingKeys.length === 0) {
      //   console.log(
      //     `No missing keys found. Dictionary ${missingKeyDict.name.toUpperCase()} includes all keys that exists in ${challengeDict.name.toUpperCase()} dictionary\n\n`
      //   );
      // } else {
      // failed = true;
      // console.log(
      //   `Were found ${missingKeys.length} missing keys.\n${missingKeys.join(
      //     ", "
      //   )}\n\n`
      // );
      // }
    }
  });
});

// if (hasFailed) throw new Error("Missing keys found");
if (hasFailed) process.exit(1);
else process.exit(0);
