export const LLM = 'llm';
export const TTS = 'tts';

const getUserPlan = (db, userId) => {
    return db.prepare(`
        SELECT p.* FROM Plan p
        JOIN User u ON u.planId = p.id
        WHERE u.id = ?
    `).get(userId);
};

const getUserQuota = (db, userId, periodStart) => {
    return db.prepare("SELECT * FROM UserQuota WHERE userId = ? AND periodStart = ?").get(userId, periodStart);
};

const createUserQuota = (db, userId, periodStart, llmQuota, ttsQuota) => {
    db.prepare("INSERT INTO UserQuota (userId, periodStart, llmQuota, ttsQuota) VALUES (?, ?, ?, ?)")
        .run(userId, periodStart, llmQuota, ttsQuota);
};

const getCurrentPeriodStart = (db) => {
    return db.prepare("SELECT unixepoch(date('now', 'start of month')) AS periodStart").get().periodStart;
};

export const checkAndIncreaseUsage = (db, userId, feature) => {
    const periodStart = getCurrentPeriodStart(db);
    let userQuota = getUserQuota(db, userId, periodStart);

    if (!userQuota) {
        const userPlan = getUserPlan(db, userId);
        if (!userPlan) return false;
        createUserQuota(db, userId, periodStart, userPlan.llmUsages, userPlan.ttsUsages);
        userQuota = getUserQuota(db, userId, periodStart);
    }

    if (feature === LLM) {
        if (userQuota.llmUsages >= userQuota.llmQuota) return false;
        db.prepare("UPDATE UserQuota SET llmUsages = llmUsages + 1 WHERE userId = ? AND periodStart = ?")
            .run(userId, periodStart);
    } else if (feature === TTS) {
        if (userQuota.ttsUsages >= userQuota.ttsQuota) return false;
        db.prepare("UPDATE UserQuota SET ttsUsages = ttsUsages + 1 WHERE userId = ? AND periodStart = ?")
            .run(userId, periodStart);
    }

    return true;
};
