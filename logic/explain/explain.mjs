import OpenAI from 'openai';
import { explanationJsonSchema } from '../../schemas/explanationJsonSchema.mjs';

const openaiProfile = {
  baseURL: 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY
};

const deepseekProfile = {
  baseURL: 'https://api.deepseek.com/',
  apiKey: process.env.DEEPSEEK_API_KEY
};

const openaiApi = {
  engine: new OpenAI(openaiProfile),
  model: 'gpt-4o-mini',
  responseFormat: explanationJsonSchema,
  systemPrompt: 'You are a language reference tool. Explain the following sentence in English, giving concise two- or three- word definitions for each word/phrase.  Do not give the part of speech; only a concise definition.'
};

const deepseekApi = {
  engine: new OpenAI(deepseekProfile),
  model: 'deepseek-chat',
  responseFormat: {
    'type': 'json_object'
  },
  systemPrompt: `You are a language reference tool. Explain the following sentence in English, giving concise two- or three- word definitions for each word/phrase.  Do not give the part of speech; only a concise definition.

EXAMPLE INPUT:
Thái độ quan trọng hơn trình độ

EXAMPLE JSON OUTPUT:
{
  "explanation": [
    {
      "term": "Thái độ",
      "definition": "attitude"
    },
    {
      "term": "quan trọng",
      "definition": "more important"
    },
    {
      "term": "hơn",
      "definition": "than"
    },
    {
      "term": "trình độ",
      "definition": "ability"
    }
  ]
}`
};

const apis = {
  openai: openaiApi,
  deepseek: deepseekApi
};

export const explain = async (phrase, apiName) => {
  const api = apis[apiName] ?? openaiApi;
  console.log(apiName, api.model);

  const messages = [
    { role: 'system', content: api.systemPrompt },
    { role: 'user', content: phrase }
  ];

  const completion = await api.engine.chat.completions.create({
    messages,
    max_tokens: 400,
    model: api.model,
    response_format: api.responseFormat
  });

  const answerJson = completion.choices[0].message.content;
  const answer = JSON.parse(answerJson);
  return answer.explanation;
}
