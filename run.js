#!/usr/bin/env bun
import { GoogleGenAI } from "@google/genai";
const fs = require("fs");
const path = require("path");
const PROMPTS_DIR = path.resolve("prompts");
import "dotenv/config";
import meow from "meow";
import ora from "ora";

const cli = meow(
  `
 Usage
   $ ${process.argv[1]} <file> [special_instructions]

 Arguments
   <file>                The file to process
   [special_instructions] Optional special instructions for processing

 Options
   --mode     The processing mode (default: psuedocode)
   --section  The header content of a section to process/refine (default: all)

 Examples
   $ ${process.argv[1]} input.md
   $ ${process.argv[1]} input.md "Generate detailed comments"
`,
  {
    importMeta: import.meta,
    flags: {
      mode: {
        type: "string",
        default: "psuedocode",
      },
    },
  },
);

const META_DELIM = "\n----\n";

if (!cli.input[0]) {
  cli.showHelp();
}

if (!process.env.GEMINI_API_KEY) {
  console.error("Please set the GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const file = cli.input[0];
const specialInstructions = cli.input[1] || "";
const mode = cli.flags.mode;
const RUNNING_PATH = "_psuedocode_history.md";

const processed = processFile(file);
const {
  prompt: PROMPT,
  replace,
  leading,
} = getPrompt({
  processed,
  mode,
  specialInstructions,
  section: cli.flags.section,
});

const OUTPUT_DIR = path.resolve("output");
if (mode === "realcode") {
  try {
    fs.mkdirSync(OUTPUT_DIR);
  } catch (e) {}
}

fs.writeFileSync("_prompt.md", PROMPT);

const result = await runPrompt(PROMPT);

if (mode === "realcode") {
  const realCodeResult = result.text;

  const titleMatch = realCodeResult.match(/<title>(.*?)<\/title>/s);
  const descriptionMatch = realCodeResult.match(
    /<description>(.*?)<\/description>/s,
  );
  const runInstructionsMatch = realCodeResult.match(
    /<run_instructions>(.*?)<\/run_instructions>/s,
  );

  const title = titleMatch ? titleMatch[1].trim() : "No title found";
  const description = descriptionMatch
    ? descriptionMatch[1].trim()
    : "No description found";
  const runInstructions = runInstructionsMatch
    ? runInstructionsMatch[1].trim()
    : "No run instructions found";

  console.log(`\nTitle: ${title}`);
  console.log(`Description: ${description}\n`);

  if (runInstructions) {
    console.log("Run Instructions:\n");
    console.log(runInstructions);
    console.log("\n");
  }
  fs.writeFileSync(
    path.resolve(OUTPUT_DIR, "README.md"),
    `# ${title}\n\n${description}\n\n# Run instructions:\n${runInstructions}`,
  );

  const fileRegex = /<file path="(.*?)" isThisLastFile="(.*?)">(.*?)<\/file>/gs;
  let fileMatch;
  while ((fileMatch = fileRegex.exec(realCodeResult)) !== null) {
    const filePath = path.resolve(OUTPUT_DIR, fileMatch[1]);
    const fileContent = getCode(fileMatch[3]);

    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, fileContent);
    console.log(`Written file: ${filePath}`);
  }

  process.exit(0);
} else {
  const res = ((t) => {
    return {
      step: t.split("<step>")[1]?.split("</step>")[0]?.trim() || "",
      more_needed:
        t
          .split("<moreStepsNeeded>")[1]
          ?.split("</moreStepsNeeded>")[0]
          ?.trim() === "true",
    };
  })(result.text);
  let updated;
  if (replace) {
    // Delete from replace[0] to replace[1] in processed.content
    updated = processed.content
      .split("\n")
      .slice(0, replace[0])
      .concat(res.step.split("\n").map((i) => leading + i))
      .concat(processed.content.split("\n").slice(replace[1]))
      .join("\n");
  } else {
    updated = res.step;
  }
  fs.writeFileSync(
    file,
    `# application: ${processed.application}\n# details: ${processed.details}\n# step: ${processed.step + 1}\n# more: ${res.more_needed}\n----\n${updated}`,
  );
}

function getUserCode({ runningPath, processed, mode, section = null }) {
  if (section) {
    return getMd(`section_${mode}`)
      .replaceAll(
        "{{REFERENCE_PSUEDOCODE}}",
        `<user_psuedocode step="${processed.step}">\n${processed.content}\n</user_psuedocode>`,
      )
      .replaceAll(
        "{{SECTION_PSUEDOCODE}}",
        `<psuedocode_snippet step="${processed.step}" startLine="${section.range[0]}" endLine="${section.range[1]}">\n${section.content}\n</psuedocode_snippet>`,
      );
  }
  if (mode === "realcode") {
    return `<user_psuedocode step="${processed.step}">\n${processed.content}\n</user_psuedocode>`;
  }
  let content;
  try {
    content = fs.readFileSync(runningPath, "utf-8")?.trim() + "\n";
  } catch (e) {
    fs.writeFileSync(runningPath, "");
  }

  let out = `${content || ""}<user_psuedocode step="${processed.step}">\n${processed.content}\n</user_psuedocode>`;
  fs.appendFileSync(runningPath, out + "\n");
  return out;
}

function processFile(_path) {
  const file = fs.readFileSync(_path, "utf-8")?.trim();
  if (!file) {
    throw new Error("No file");
  }
  if (file.split(META_DELIM).length < 2) {
    return {
      content: file,
      step: 0,
      more_needed: true,
      application: file.trim().split("\n")[0],
      details: "",
    };
  }
  const front = Object.fromEntries(
    file
      .split("\n")
      .filter((i) => i.startsWith("# "))
      .filter((i) => i.split(": ").length > 1)
      .map((i) => i.split(": ").slice(0, 2))
      .map((i) => [i[0].toLowerCase().replace(/^#/, "").trim(), i[1].trim()])
      .map((i) => [
        i[0],
        isNaN(parseInt(i[1]))
          ? ["true", "false"].includes(i[1])
            ? JSON.parse(i[1])
            : i[1]
          : parseInt(i[1]),
      ]),
  );
  const content = file.split(META_DELIM).slice(1).join(META_DELIM).trim();
  return { content, step: 0, more_needed: true, ...front };
}

function getMd(name) {
  return fs
    .readFileSync(path.resolve(PROMPTS_DIR, name + ".md"), "utf-8")
    ?.trim();
}

function getCode(str) {
  let out = "";
  if (!str.trim()?.startsWith("```")) {
    return str.trim();
  }
  try {
    let g = str.match(
      /(?:```([a-zA-Z0-9]+)?\n(?<one>[\s\S]+?)```|[`'"](?<two>.+)[`'"])/i,
    ).groups;
    out = g.one || g.two || g;
  } catch (error) {
    out = str;
  }

  return wtspc(out.trim());
}

function getLines(str, line) {
  const lines = str.split("\n");
  const start = lines.findIndex((i) =>
    normalize(i).startsWith(normalize(line)),
  );
  const leadingWhitespace = wtspc(lines[start].match(/^\s*/)[0]);
  let out = [lines[start]];
  let endIdx = start;
  for (let idx = start + 1; idx < lines.length; idx++) {
    if (lines[idx]?.match(new RegExp(`^${leadingWhitespace}\\s+`))) {
      out.push(lines[idx].replace(new RegExp(`^${leadingWhitespace}`), ""));
      endIdx = idx;
    } else {
      break;
    }
  }
  return {
    content: out.join("\n").trim(),
    range: [start, endIdx + 1],
    leading: leadingWhitespace,
  };
}

function wtspc(t) {
  return t
    .split("\n")
    .map((line) => line.replace(/^\t+/g, (match) => "  ".repeat(match.length)))
    .join("\n");
}

function normalize(str) {
  return str
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

async function runPrompt(message) {
  const allKeys = process.env.GEMINI_API_KEY.split(":").map((i) => i.trim());
  const apiKey = allKeys[Math.floor(Math.random() * allKeys.length)];
  const ai = new GoogleGenAI({
    apiKey,
  });
  const spinner = ora("Generating content with Gemini...").start();
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-preview-05-20",
      contents: message,
    });

    let fullText = "";
    for await (const chunk of response) {
      spinner.stop();
      spinner.clear();
      console.log(chunk.text);
      fullText += chunk.text;
    }

    return { text: fullText };
  } catch (error) {
    spinner.fail("Failed to generate content.");
    console.error(error);
    process.exit(1);
  }
}

function getPrompt({ processed, mode, specialInstructions, section = null }) {
  let s = section ? getLines(processed.content, section) : null;
  if (section && !s) {
    throw new Error(`Section "${section}" not found in the content.`);
  }

  let out = `${getMd(`preamble_${mode}`)}\n\n${mode === "realcode" ? "" : getMd("examples")}\n\n${getMd(`instructions_${mode}`)}\n\n${getMd(`user_${mode}`)}\n\n${specialInstructions?.trim()?.length ? getMd("instructions") : ""}\n\n${getMd(`final_${section ? "section_" : ""}${mode}`)}`;

  out = out
    .replaceAll("{{APPLICATION}}", processed.application)
    .replaceAll("{{DETAILS}}", processed.details)
    .replaceAll(
      "{{USER_PSUEDOCODE}}",
      getUserCode({ runningPath: RUNNING_PATH, processed, mode, section: s }),
    )
    .replaceAll("{{INSTRUCTIONS}}", specialInstructions)
    .replaceAll("\n\n\n\n", "\n\n");

  return {
    prompt: out.trim(),
    replace: s ? s.range : null,
    leading: s ? s.leading : null,
  };
}
