import { DateTime } from 'luxon';

/**
 * 
 * @param {Object} payload 
 * @returns {Date}
 */
export const computeNextRunAt = (payload) => {
    const { timeOfDay, timezone = 'UTC', frequency, startDate, daysOfWeek } = payload;

    let start;
    if (startDate) {
        start = DateTime.fromJSDate(new Date(startDate)).setZone(timezone);
    } else {
        start = DateTime.now().setZone(timezone);
    }

    const now = DateTime.now().setZone(timezone);

    if (start < now) {
        start = now;
    }

    const [hour, minute] = timeOfDay.split(':').map(Number);

    let nextRun = start.set({ hour, minute, second: 0, millisecond: 0 });


    if (nextRun <= now) {
        nextRun = nextRun.plus({ days: 1 });
    }

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

/**
 * 
 * @param {Date} lastSent
 * @param {Object} schedule
 * @returns {Date} 
 */
export const computeNextAfter = (lastSent, schedule) => {
    const { timeOfDay, timezone = 'UTC', frequency, daysOfWeek } = schedule;

    const last = DateTime.fromJSDate(new Date(lastSent)).setZone(timezone);
    const [hour, minute] = timeOfDay.split(':').map(Number);

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
