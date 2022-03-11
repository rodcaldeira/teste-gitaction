const fs = require("fs");

function compareDicts() {
  // const pathToDicts = "../../src/assets/i18n";
  const pathToDicts = ".";
  let failed = false;

  const dicts = fs.readdirSync(pathToDicts);
  let dictKeysSorted = [];

  dicts.forEach((dict) => {
    if (dict.endsWith(".json")) {
      // loadedDicts.push(dict);
      const loadedDictJson = JSON.parse(
        fs.readFileSync(pathToDicts + "/" + dict, "utf8")
      );
      const jsonKeys = Object.keys(loadedDictJson);

      dictKeysSorted.push({
        name: dict.replace(".json", ""),
        keys: jsonKeys,
        length: jsonKeys.length,
      });
    }
  });

  dictKeysSorted.forEach((challengeDict) => {
    dictKeysSorted.forEach((missingKeyDict) => {
      if (challengeDict.name !== missingKeyDict.name) {
        let missingKeys = [];
        console.log(
          `Searching missing keys in... ${missingKeyDict.name.toUpperCase()} from ${challengeDict.name.toUpperCase()}`
        );
        challengeDict.keys.forEach((key) => {
          if (!missingKeyDict.keys.includes(key)) {
            missingKeys.push(key);
          }
        });
        if (missingKeys.length === 0) {
          console.log(
            `No missing keys found. Dictionary ${missingKeyDict.name.toUpperCase()} includes all keys that exists in ${challengeDict.name.toUpperCase()} dictionary\n\n`
          );
        } else {
          failed = true;
          console.log(
            `Were found ${missingKeys.length} missing keys.\n${missingKeys.join(
              "\n"
            )}\n\n`
          );
        }
      }
    });
  });
  return failed;
}

let response = compareDicts();
console.log("falhou?", response);
if (response) process.exit(0);
else process.exit(1);
