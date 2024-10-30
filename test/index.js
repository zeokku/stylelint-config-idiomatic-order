import fs from "fs";
import stylelint from "stylelint";

import config from "../index.js";

const fixtures = [
  fs.readFileSync("./test/fixture-0.scss", "utf8"),
  fs.readFileSync("./test/fixture-1.scss", "utf8"),
];

fixtures.forEach(async (code, i) => {
  const result = await stylelint.lint({
    code,
    config,
    fix: true,
  });

  fs.writeFileSync(`./test/result-${i}.scss`, result.code);
});
