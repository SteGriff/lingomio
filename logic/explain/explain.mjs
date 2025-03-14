import OpenAI from 'openai';
import { responseFormat } from './responseFormat.mjs';
import ISO6391 from 'iso-639-1';

const openai = new OpenAI(); // key defaults to process.env["OPENAI_API_KEY"]

const languageCodeToName = (code) => {
    // use iso-639-1 to get the language name from the code
    return ISO6391.getName(code);
}

export const explain = async (languageCode, phrase) => {
    const languageName = languageCodeToName(languageCode);
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
