export const normalizePhrase = (phrase) => {
    return phrase.toLowerCase().replace(/\s+/g, ' ').trim();
};

export const getCachedExplanation = (db, normalizedPhrase) => {
    const result = db
        .prepare("SELECT explanation FROM PhraseCache WHERE normalizedPhrase = ?")
        .get(normalizedPhrase);
    return result ? JSON.parse(result.explanation) : null;
};

export const cacheExplanation = (db, normalizedPhrase, explanation) => {
    const explanationJson = JSON.stringify(explanation);
    db.prepare("INSERT INTO PhraseCache (normalizedPhrase, explanation) VALUES (?, ?)")
        .run(normalizedPhrase, explanationJson);
};