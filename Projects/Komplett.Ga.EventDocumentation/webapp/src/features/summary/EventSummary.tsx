import classes from './EventSummary.module.css';

import { SimpleGrid } from '@mantine/core';
import { IconClipboardOff, IconDatabaseImport, IconFileAnalytics } from "@tabler/icons-react";

import SummaryCard from "./components/SummaryCard.tsx";

import { Event } from "../../types/Event.ts";
import { EventStat } from "../../types/EventStat.ts";

interface EventSummaryProps {
    events: Event[];
}

const EventSummary = ({ events }: EventSummaryProps) => {
    const eventStats: EventStat[] = [
        {
            title: 'Undocumented',
            value: events.filter((event) => !event.description).length,
            icon: <IconClipboardOff size={28} stroke={1.5} />,
            color: "var(--mantine-color-red-4)"
        },
        {
            title: 'Documented',
            value: events.filter((event) => event.description).length,
            icon: <IconFileAnalytics size={28} stroke={1.5} />,
            color: "var(--mantine-color-teal-4)"
        },
        {
            title: 'Total events',
            value: events.length,
            icon: <IconDatabaseImport size={28} stroke={1.5} /> ,
            color: "var(--mantine-color-blue-4)"
        },
    ];

    return (
        <div className={classes.root}>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                {eventStats.map((eventStat) => 
                    <SummaryCard 
                        key={eventStat.title} 
                        eventStat={eventStat}
                    />
                )}
            </SimpleGrid>
        </div>
    );
};

export default EventSummary;
