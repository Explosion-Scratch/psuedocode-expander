#!/usr/bin/env bun
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import "dotenv/config";
import meow from "meow";
import ora from "ora";
import { diffLines } from "diff";

const PROMPTS_DIR = path.resolve("prompts");
const RUNNING_PATH = "_psuedocode_history.md"; // file where user_psuedocode blocks are stored
const META_DELIM = "\n----\n";

// CLI setup
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
   --dry-run  Print the prompt to stdout instead of running it

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
      dryRun: {
        type: "boolean",
        default: false,
      },
      section: {
        type: "string",
        default: "all",
      },
    },
  },
);

if (!cli.input[0]) {
  cli.showHelp();
}
if (!process.env.GEMINI_API_KEY) {
  console.error("Please set the GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const filePath = cli.input[0];
const specialInstructions = cli.input[1] || "";
const mode = cli.flags.mode;
const OUTPUT_DIR = path.resolve("output");

// Process file to get pseudocode content and meta data
const processed = processFile(filePath);

// Get the prompt text based on the file & mode:
const {
  prompt: PROMPT,
  replace,
  leading,
} = getPrompt({
  processed,
  mode,
  specialInstructions,
  section: cli.flags.section !== "all" ? cli.flags.section : null,
  dryRun: cli.flags.dryRun,
});

// Make sure the OUTPUT_DIR exists if we are in real code mode.
if (mode === "realcode") {
  try {
    fs.mkdirSync(OUTPUT_DIR);
  } catch (e) {
    // ignore if already exists
  }
}

// In dry-run mode, output the prompt and exit.
if (cli.flags.dryRun) {
  console.log(PROMPT);
  process.exit(0);
} else {
  fs.writeFileSync("_prompt.md", PROMPT);
}

// Run the prompt
const result = await runPrompt(PROMPT);

if (mode === "realcode") {
  // Process realcode output.
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
    console.log("Run Instructions:\n", runInstructions, "\n");
  }
  fs.writeFileSync(
    path.resolve(OUTPUT_DIR, "README.md"),
    `# ${title}\n\n${description}\n\n# Run Instructions:\n${runInstructions}`,
  );

  // Create files from output
  const fileRegex = /<file path="(.*?)" isThisLastFile="(.*?)">(.*?)<\/file>/gs;
  let fileMatch;
  while ((fileMatch = fileRegex.exec(realCodeResult)) !== null) {
    const filePathReal = path.resolve(OUTPUT_DIR, fileMatch[1]);
    const fileContent = getCode(fileMatch[3]);
    const dirPath = path.dirname(filePathReal);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePathReal, fileContent);
    console.log(`Written file: ${filePathReal}`);
  }
  process.exit(0);
} else {
  // In non-realcode mode, extract tags from response text.
  const res = (function extractTags(t) {
    const futureFeatures = extractTag("future_feature", t);
    // using "possible_bug" from response and label it as bugs
    const bugs = extractTag("possible_bug", t);
    const needsRegression = extractTag("needs_regression", t);
    const designDetails = extractTag("design_details", t);

    return {
      step: t.split("<step>")[1]?.split("</step>")[0]?.trim() || "",
      more_needed:
        t
          .split("<moreStepsNeeded>")[1]
          ?.split("</moreStepsNeeded>")[0]
          ?.trim() === "true",
      futureFeatures,
      bugs,
      needsRegression,
      designDetails,
    };
  })(result.text);

  // Update file with new pseudocode.
  let updated;
  if (replace) {
    // Replace block in processed.content between replace indices
    const lines = processed.content.split("\n");
    updated =
      lines.slice(0, replace[0]).join("\n") +
      "\n" +
      res.step
        .split("\n")
        .map((i) => leading + i)
        .join("\n") +
      "\n" +
      lines.slice(replace[1]).join("\n");
  } else {
    updated = res.step;
  }
  const originalContent = fs.readFileSync(filePath, "utf-8");

  fs.writeFileSync(
    filePath,
    `# application: ${processed.application}\n` +
      `# details: ${processed.details}\n` +
      `# step: ${processed.step + 1}\n` +
      `# more: ${res.more_needed}\n----\n${updated}`,
  );

  const updatedContent = fs.readFileSync(filePath, "utf-8");

  displayDiff(originalContent, updatedContent);

  // Display extracted bullet lists
  const bulletpoints = (arr) =>
    arr.length ? arr.map((i) => `- ${i}`).join("\n") + "\n\n" : "None\n\n";
  console.log("🚀 Future Features:\n", bulletpoints(res.futureFeatures));
  console.log("🐞 Bugs:\n", bulletpoints(res.bugs));
  console.log("🔄 Needs Regression:\n", bulletpoints(res.needsRegression));
  console.log("🎨 Design Details:\n", bulletpoints(res.designDetails));

  // Append the new step block (with nested tags for pseudocode, future features, and bugs)
  appendUserPsuedocodeHistory({
    runningPath: RUNNING_PATH,
    stepNum: processed.step,
    pseudocode: res.step,
    futureFeatures: res.futureFeatures,
    bugs: res.bugs,
    designDetails: res.designDetails,
  });
}

/* Helper function that appends a new pseudocode block (with extra tags) to the history file */
function appendUserPsuedocodeHistory({
  runningPath,
  stepNum,
  pseudocode,
  futureFeatures,
  bugs,
  designDetails,
}) {
  const block = `<user_psuedocode_details step="${stepNum}">
${futureFeatures && futureFeatures.length ? futureFeatures.map((i) => `<future_feature>${i}</future_feature>`).join("\n") : ""}
${bugs && bugs.length ? bugs.map((i) => `<possible_bug>${i}</possible_bug>`).join("\n") : ""}
${designDetails && designDetails.length ? `<design_details>\n${designDetails}\n</design_details>` : ""}
</user_psuedocode_details>\n`;
  try {
    fs.appendFileSync(runningPath, block);
    console.log(
      `Appended pseudocode history block for step ${stepNum} to ${runningPath}`,
    );
  } catch (err) {
    console.error("Error appending to pseudocode history file:", err);
  }
}

function displayDiff(originalContent, updatedContent) {
  const diff = diffLines(originalContent, updatedContent);
  console.log("\nDiff:");
  diff.forEach((part) => {
    if (part.added) {
      console.log(`\x1b[32m${part.value}\x1b[0m`); // Green for additions
    } else if (part.removed) {
      console.log(`\x1b[31m${part.value}\x1b[0m`); // Red for deletions
    } else {
      console.log(`\x1b[37m${part.value}\x1b[0m`); // Grey for unchanged
    }
  });
}

function getUserCode({
  runningPath,
  processed,
  mode,
  section = null,
  dryRun = false,
}) {
  // If a section is specified, we use templates.
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
  if (!dryRun) {
    fs.appendFileSync(runningPath, out + "\n");
  }
  return out;
}

function processFile(_path) {
  let file;
  try {
    file = fs.readFileSync(_path, "utf-8")?.trim();
  } catch (e) {}
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
  if (!str.trim()?.startsWith("```")) {
    return str.trim();
  }
  try {
    const groups = str.match(
      /(?:```([a-zA-Z0-9]+)?\n(?<one>[\s\S]+?)```|[`'"](?<two>.+)[`'"])/i,
    ).groups;
    return (groups.one || groups.two || str).trim();
  } catch (error) {
    return str;
  }
}

function getLines(str, line) {
  console.log({ str, line });
  const lines = str.split("\n");
  const start = lines.findIndex((i) =>
    normalize(i).startsWith(normalize(line)),
  );
  const leadingWhitespace = (lines[start].match(/^\s*/) || [""])[0];
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
  // return { text: fs.readFileSync("fake.md", "utf-8")?.trim() };

  const allKeys = process.env.GEMINI_API_KEY.split(":").map((i) => i.trim());
  const apiKey = allKeys[Math.floor(Math.random() * allKeys.length)];
  const ai = new GoogleGenAI({ apiKey });
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

function getPrompt({
  processed,
  mode,
  specialInstructions,
  section = null,
  dryRun,
}) {
  let s = section ? getLines(processed.content, section) : null;
  if (section && !s) {
    throw new Error(`Section "${section}" not found in the content.`);
  }
  let out =
    `${getMd(`preamble_${mode}`)}\n\n` +
    `${mode === "realcode" ? "" : getMd("examples")}\n\n` +
    `${getMd(`instructions_${mode}`)}\n\n` +
    `${getMd(`user_${mode}`)}\n\n` +
    `${specialInstructions?.trim()?.length ? getMd("instructions") : ""}\n\n` +
    `${getMd(`final_${section ? "section_" : ""}${mode}`)}`;
  // Replace placeholders in the prompt text.
  const replace = (key, val) => (str) => {
    // If the key is a special placeholder and the val is empty then delete that line
    if (/^\{\{[a-z0-9]+\}\}$/i.test(key)) {
      if (val?.trim()?.length) {
        return str.replaceAll(key, val);
      } else {
        return str
          .split("\n")
          .filter((i) => !i.includes(key))
          .join("\n");
      }
    }
    return str.replaceAll(key, val);
  };
  out = [
    replace("{{APPLICATION}}", processed.application),
    replace("{{DETAILS}}", processed.details),
    replace(
      "{{USER_PSUEDOCODE}}",
      getUserCode({
        runningPath: RUNNING_PATH,
        processed,
        mode,
        section: s,
        dryRun,
      }),
    ),
    replace("{{INSTRUCTIONS}}", specialInstructions),
    replace("\n\n\n\n", "\n\n"),
  ].reduce((acc, fn) => fn(acc), out);
  return {
    prompt: out.trim(),
    replace: s ? s.range : null,
    leading: s ? s.leading : null,
  };
}

function extractTag(tagName, text) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "g");
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}
