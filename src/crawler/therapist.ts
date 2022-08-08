import { TimeSlot } from "./date";

export interface Therapist {
    name: string;
    url: string;
    time_slots: TimeSlot[];
};

