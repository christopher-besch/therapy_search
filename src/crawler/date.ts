export interface TimeSlot {
    start: Date;
    end: Date;
};

export enum Day {
    monday = 1,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
};

function get_day(raw_day: string): Day {
    switch (raw_day) {
        case "Mo":
            return Day.monday;
        case "Di":
            return Day.tuesday;
        case "Mi":
            return Day.wednesday;
        case "Do":
            return Day.thursday;
        case "Fr":
            return Day.friday;
        case "Sa":
            return Day.saturday;
        case "So":
            return Day.sunday;
        default:
            throw `can't identify ${raw_day}`;
    }
}

export function get_date(raw_day: string): Date {
    const day = get_day(raw_day);
    let date = new Date();
    // searching for a Monday -> get any Monday in the current week
    date.setDate(date.getDate() + (day - date.getDay()));
    return date;
}

export function add_time_to_date(date: Date, raw_time: string): Date {
    let date_cpy = new Date(date);
    const splitted_time = raw_time.split(":") as [string, string];
    date_cpy.setHours(Number(splitted_time[0]), Number(splitted_time[1]), 0, 0);
    return date_cpy;
}

