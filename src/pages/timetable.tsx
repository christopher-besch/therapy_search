import { PageProps } from "gatsby";
import * as React from "react";
import Layout from "src/components/layout";
import { get_data } from "src/crawler/arztsuche_bw_de";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface CalEvent {
    title: string;
    start: Date;
    end: Date;
}

const TimetablePage = (props: PageProps) => {
    let [events, set_events] = React.useState<CalEvent[]>([]);

    const params = new URLSearchParams(props.location.search);
    const url = params.get("url")!;
    React.useEffect(() => {
        get_data(url, (therapists) => {
            let new_events: CalEvent[] = [];
            for (let therapist of therapists) {
                for (let time_slot of therapist.time_slots) {
                    new_events.push({
                        title: therapist.name,
                        start: time_slot.start,
                        end: time_slot.end,
                    });
                }
            }
            console.log(new_events.map(event => `${event.title}: \t${event.start.toLocaleTimeString()}–${event.end.toLocaleTimeString()}`).join("\n"));
            set_events(new_events);
        });
    }, []);

    moment.tz.setDefault("Europe/Berlin");
    const localizer = momentLocalizer(moment);

    return (
        <Layout>
            <Calendar
                localizer={localizer}
                events={events}
            />
        </Layout>
    );
};

export default TimetablePage;

