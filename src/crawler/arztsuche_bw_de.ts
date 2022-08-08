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

function get_name(name_row_data: Element): string {
    const raw_name = name_row_data.children[0]!.innerHTML;
    return raw_name.replaceAll("<br>", "");
}

function get_url(raw_therapist: Element): string {
    const auswahl_row = raw_therapist.getElementsByClassName("auswahl")[1]!;
    const checkbox = auswahl_row.children[0] as HTMLInputElement;
    const id = checkbox.value;
    return `https://www.arztsuche-bw.de/index.php?suchen=3&checkbox_cmd=pdf&checkbox_content=${id}`;
}

function get_therapist_amount(vdocument: Document): number {
    const hits = vdocument.getElementsByClassName("anzahl_treffer")[0]!;
    const raw_amount = hits.children[0]!.innerHTML;
    const matches = raw_amount.match(/\s(\d+) Treffern$/)!;
    return Number(matches[1]);
}

// add new therapists to therapist parameter
function get_therapists(
    vdocument: Document,
    therapists: Therapist[],
    target_length: number,
    onload: (therapists: Therapist[]) => void,
): void {
    const raw_therapists = vdocument.getElementsByClassName("resultrow");
    for (const raw_therapist of Array.from(raw_therapists)) {
        const name_row = raw_therapist.getElementsByClassName("name")[1]!;
        const name_row_data = name_row.children[0]!;

        therapists.push({
            name: get_name(name_row_data),
            url: get_url(raw_therapist),
            time_slots: get_all_time_slots(name_row_data),
        });
    }
    // loading finished?
    if (therapists.length == target_length)
        onload(therapists);
}

// get all therapists that aren't on first page
function get_other_therapists(
    url_handler: URL,
    therapists: Therapist[],
    target_length: number,
    onload: (therapists: Therapist[]) => void,
): void {
    for (let offset = 20; offset < target_length; offset += 20) {
        console.log(`crawling at offset ${offset}`);
        url_handler.searchParams.set("offset", offset.toString());
        load_virtual_document(url_handler, (vdocument) => {
            get_therapists(vdocument, therapists, target_length, onload);
        });
    }
}

export function get_data(url: string, onload: (therapists: Therapist[]) => void): void {
    let url_handler = new URL(url);
    url_handler.searchParams.set("offset", "0");

    load_virtual_document(url_handler, (vdocument) => {
        let target_length = get_therapist_amount(vdocument);

        let therapists: Therapist[] = [];
        get_other_therapists(url_handler, therapists, target_length, onload);
        get_therapists(vdocument, therapists, target_length, onload);
    });
}

