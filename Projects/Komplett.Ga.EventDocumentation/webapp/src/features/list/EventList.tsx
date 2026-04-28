import { useMemo } from "react";
import { Accordion, Alert } from "@mantine/core";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { IconAlertCircle } from "@tabler/icons-react";

import EventItem from "./components/EventItem.tsx";
import { Event } from "../../types/Event.ts";
import { safelyParseJson } from "../../utils/formatter.ts";

interface EventListProps {
    events: Event[];
    searchQuery: string;
    tagQuery: string;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Event[], Error>>;
}

const EventList = ({ events, searchQuery, tagQuery, refetch }: EventListProps) => {
    const filteredEvents = useMemo(() => {
        return events
            .filter(event => 
                event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter(event => {
                if (!tagQuery) return true;

                return safelyParseJson<string>(event.tags).includes(tagQuery);
            })
            .sort((a, b) => a.eventName.localeCompare(b.eventName));
    }, [events, searchQuery, tagQuery]);

    if (filteredEvents.length === 0) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
                No events match your search criteria
            </Alert>
        );
    }
    
    return (
        <Accordion variant="separated" multiple>
            {filteredEvents.map(item => (
                <EventItem 
                    key={item.eventName} 
                    item={item}
                    refetch={refetch}
                />
            ))}
        </Accordion>
    );
};

export default EventList;
