export const responseFormat = {
  "type": "json_schema",
  "json_schema": {
    "name": "explanation",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "explanation": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "term": {
                "type": "string"
              },
              "definition": {
                "type": "string"
              }
            },
            "required": [
              "term",
              "definition"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "explanation"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    }
  }
};