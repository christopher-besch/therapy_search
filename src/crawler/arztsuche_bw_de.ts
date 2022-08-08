import { load_virtual_document } from "./crawler";
import { add_time_to_date, get_date, TimeSlot } from "./date";
import { Therapist } from "./therapist";

function find_tel_table(name_row_data: Element): Element | undefined {
    const children = name_row_data.children;

    for (let i = 0; i < children.length; ++i) {
        const child = children[i]!;
        if (child.nodeName == "DT" &&
            child.innerHTML.indexOf("Telefonische Erreichbarkeit") != -1)
            if (children.length > i + 1)
                return children[i + 1]?.getElementsByTagName("tbody")[0];
    }
    return undefined;
}

function get_time_slot(date: Date, slot_str: string): TimeSlot {
    let border_times = slot_str.split("-") as [string, string];
    return {
        start: add_time_to_date(date, border_times[0]),
        end: add_time_to_date(date, border_times[1]),
    };
}

function get_day_time_slots(row: Element): TimeSlot[] {
    let time_slots: TimeSlot[] = [];
    // TODO: compile day already here
    const raw_day = row.children[0]!.innerHTML.replaceAll(/[^a-z]/ig, "");
    const day = get_date(raw_day);
    for (let i = 1; i < row.children.length; ++i) {
        let raw_str = row.children[i]!.innerHTML.replaceAll(/\s/g, "");
        // sometimes multiple time slots are in a single table cell
        for (let slot_str of raw_str.split("<br>")) {
            // when this is only a placeholder
            if (raw_str.indexOf("-") == -1)
                continue;
            time_slots.push(get_time_slot(day, slot_str));
        }
    }
    return time_slots;
}

function get_week_time_slots(tel_table: Element): TimeSlot[] {
    let time_slots: TimeSlot[] = [];
    const rows = tel_table.children;
    for (let i = 0; i < rows.length; ++i) {
        time_slots = time_slots.concat(get_day_time_slots(rows[i]!));
    }
    return time_slots;
}

function get_all_time_slots(name_row_data: Element): TimeSlot[] {
    const tel_table = find_tel_table(name_row_data);
    if (tel_table != undefined) {
        return get_week_time_slots(tel_table);
    }
    return [];
}

export function get_data(url: string, onload: (therapists: Therapist[]) => void): void {
    load_virtual_document(url, (vdocument) => {
        let therapists: Therapist[] = [];
        const raw_therapists = vdocument.getElementsByClassName("resultrow");
        for (const raw_therapist of Array.from(raw_therapists)) {
            const name_row = raw_therapist.getElementsByClassName("name")[1]!;
            const name_row_data = name_row.children[0]!;
            const raw_name = name_row_data.children[0]!.innerHTML;
            const name = raw_name.replaceAll("<br>", "");

            const time_slots = get_all_time_slots(name_row_data);

            therapists.push({
                name: name,
                info_url: "",
                time_slots: time_slots,
            });
        }
        onload(therapists);
    });
}

