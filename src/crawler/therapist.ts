import { TimeSlot } from "./date";

export interface Therapist {
    name: string;
    info_url: string;
    time_slots: TimeSlot[];
};

