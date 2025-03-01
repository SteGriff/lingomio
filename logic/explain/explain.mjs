import OpenAI from 'openai';
import { responseFormat } from './responseFormat.mjs';

const openai = new OpenAI(); // key defaults to process.env["OPENAI_API_KEY"]

export const explain = async (languageName, phrase) => {
    const devPrompt = languageName
        ? `Explain the ${languageName} sentence word-by-word`
        : `Explain this sentence word-by-word. BE CONCISE.`;

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'developer', content: devPrompt },
            { role: 'user', content: phrase }
        ],
        max_tokens: 200,
        model: 'gpt-4o-mini',
        response_format: responseFormat
    });

    const answerJson = completion.choices[0].message.content;
    const answer = JSON.parse(answerJson);
    return answer.explanation;
}
