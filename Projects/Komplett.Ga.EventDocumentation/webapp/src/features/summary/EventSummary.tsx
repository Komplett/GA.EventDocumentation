import classes from './EventSummary.module.css';

import { SimpleGrid } from '@mantine/core';
import { useQuery } from "@tanstack/react-query";
import { IconClipboardOff, IconDatabaseImport, IconFileAnalytics } from "@tabler/icons-react";

import { getEvents } from "../list/api/eventRequests.ts";
import SummaryCard from "./components/SummaryCard.tsx";

import { Event } from "../../types/Event.ts";
import { EventStat } from "../../types/EventStat.ts";

const EventSummary = () => {
    const { data, error, isLoading } = useQuery<Event[]>({
        queryKey: ["getEvents"],
        queryFn: getEvents,
    });

    if (isLoading) return <p>Loading module...</p>;
    if (error || !data) return <p>Error: {error?.message || 'Missing data'}</p>;

    const eventStats: EventStat[] = [
        {
            title: 'Undocumented',
            value: data.filter((event: Event) => !event.description).length,
            icon: <IconClipboardOff size={28} stroke={1.5} />,
            color: "var(--mantine-color-red-4)"
        },
        {
            title: 'Documented',
            value: data.filter((event: Event) => event.description).length,
            icon: <IconFileAnalytics size={28} stroke={1.5} />,
            color: "var(--mantine-color-teal-4)"
        },
        {
            title: 'Total events',
            value: data.length,
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
}

export default EventSummary;