import { PageProps } from "gatsby";
import * as React from "react";
import Layout from "src/components/layout";
import { get_data } from "src/crawler/arztsuche_bw_de";
import { Calendar, momentLocalizer, Event as CalEvent } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { test_cors_anywhere } from "src/crawler/crawler";

const TimetablePage = (props: PageProps) => {
    let [events, set_events] = React.useState<CalEvent[]>([]);

    const params = new URLSearchParams(props.location.search);
    const url = params.get("url")!;
    React.useEffect(() => {
        test_cors_anywhere();
        get_data(url, (therapists) => {
            let new_events: CalEvent[] = [];
            for (let therapist of therapists) {
                for (let time_slot of therapist.time_slots) {
                    new_events.push({
                        start: time_slot.start,
                        end: time_slot.end,
                        resource: {
                            name: therapist.name,
                            url: therapist.url,
                        },
                    });
                }
            }
            // console.log(new_events.map(event => `${event.title}: \t${event.start.toLocaleTimeString()}–${event.end.toLocaleTimeString()}`).join("\n"));
            for (let therapist of therapists) {
                console.log(`${therapist.name}: ${therapist.url}`);
            }
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
                // onView={() => {  }}
                views={{ month: false, week: false, work_week: true, day: true, agenda: true }}
                defaultView="work_week"
                titleAccessor={(event) => event.resource.name}
                tooltipAccessor={(event) => event.resource.name}
                onSelectEvent={(event) => window.open(event.resource.url, "_blank")}
                dayLayoutAlgorithm="no-overlap"
            />
        </Layout>
    );
};

export default TimetablePage;

