import fs from "fs";
import { explanationJsonSchema as explanationBuilder } from "../schema-builders/explanation.schema.mjs";

// Build each Schema JSON to a file 
// so that we can remove zod dependency at runtime

const builders = [explanationBuilder];

for (const builder of builders) {
    console.log(builder);
    const jsonSchema = JSON.stringify(builder.schema, null, 2);
    const content = `export const ${builder.name}JsonSchema = ${jsonSchema};`;
    fs.writeFileSync(`schemas/${builder.name}JsonSchema.mjs`, content);
}
