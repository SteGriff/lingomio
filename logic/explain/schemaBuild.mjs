import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import fs from "fs";

const explanationTerm = z.object({
    term: z.string(),
    definition: z.string()
});
const explanationFormat = z.object({
    explanation: z.array(explanationTerm)
});
const responseFormat = zodResponseFormat(explanationFormat, "explanation");

// Save the responseFormat JSON to a file so that we can remove zod dependency:
const jsonSchema = JSON.stringify(responseFormat, null, 2);
const content = `export const responseFormat = ${jsonSchema};`;

fs.writeFileSync("responseFormat.mjs", content);
