import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const explanationTerm = z.object({
    term: z.string(),
    definition: z.string()
});
const explanationFormat = z.object({
    explanation: z.array(explanationTerm)
});

const name = "explanation";
export const explanationBuilder = {
    name,
    schema: zodResponseFormat(explanationFormat, name)
}
