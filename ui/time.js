export const getTimeSince = (uts) => {
    const now = new Date() / 1000;
    const seconds = Math.floor(now - uts);
    let interval = seconds / 31536000;
    if (interval > 1)
        return Math.floor(interval) + " years";

    interval = seconds / 2592000;
    if (interval > 1)
        return Math.floor(interval) + " months";

    interval = seconds / 86400;
    if (interval > 1)
        return Math.floor(interval) + " days";

    interval = seconds / 3600;
    if (interval > 1)
        return Math.floor(interval) + " hours";

    interval = seconds / 60;
    if (interval > 1)
        return Math.floor(interval) + " minutes";

    return Math.floor(seconds) + " seconds";
}