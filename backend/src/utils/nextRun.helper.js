import { DateTime } from 'luxon';

/**
 * Compute the next run time based on schedule payload.
 * @param {Object} payload - { timeOfDay: 'HH:mm', timezone: 'Asia/Kolkata', frequency: 'DAILY' | 'WEEKLY', startDate: Date, daysOfWeek: [1, 3] }
 * @returns {Date} Next run date
 */
export const computeNextRunAt = (payload) => {
    const { timeOfDay, timezone = 'UTC', frequency, startDate, daysOfWeek } = payload;

    // Parse start date in target timezone
    let start = DateTime.fromJSDate(new Date(startDate)).setZone(timezone);
    const now = DateTime.now().setZone(timezone);

    // If start date is in the past, start from now
    if (start < now) {
        start = now;
    }

    const [hour, minute] = timeOfDay.split(':').map(Number);

    // Set the target time on the start date
    let nextRun = start.set({ hour, minute, second: 0, millisecond: 0 });

    // If the calculated time is in the past relative to 'now', move to next candidate
    if (nextRun <= now) {
        nextRun = nextRun.plus({ days: 1 });
    }

    if (frequency === 'DAILY') {
        // Already moved to next day if passed, so just return
        return nextRun.toJSDate();
    }

    if (frequency === 'WEEKLY') {
        // Find the next matching day of week
        // daysOfWeek is array of 1-7 (Monday is 1)
        while (!daysOfWeek.includes(nextRun.weekday)) {
            nextRun = nextRun.plus({ days: 1 });
        }
        return nextRun.toJSDate();
    }

    // Default fallback (should not happen if validated)
    return nextRun.toJSDate();
};

/**
 * Compute the next run time after the last execution.
 * @param {Date} lastSent - Timestamp of last execution
 * @param {Object} schedule - Schedule object from DB
 * @returns {Date} Next run date
 */
export const computeNextAfter = (lastSent, schedule) => {
    const { timeOfDay, timezone = 'UTC', frequency, daysOfWeek } = schedule;

    const last = DateTime.fromJSDate(new Date(lastSent)).setZone(timezone);
    const [hour, minute] = timeOfDay.split(':').map(Number);

    // Start checking from the day AFTER the last sent
    let nextRun = last.plus({ days: 1 }).set({ hour, minute, second: 0, millisecond: 0 });

    if (frequency === 'DAILY') {
        return nextRun.toJSDate();
    }

    if (frequency === 'WEEKLY') {
        while (!daysOfWeek.includes(nextRun.weekday)) {
            nextRun = nextRun.plus({ days: 1 });
        }
        return nextRun.toJSDate();
    }

    return nextRun.toJSDate();
};
