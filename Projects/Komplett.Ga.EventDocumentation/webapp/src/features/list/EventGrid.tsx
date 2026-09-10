import { useMemo } from "react";
import { Alert, ScrollArea, SimpleGrid } from "@mantine/core";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { IconAlertCircle } from "@tabler/icons-react";

import EventCard from "./components/EventCard.tsx";
import { Event } from "../../types/Event.ts";
import { safelyParseJson } from "../../utils/formatter.ts";
import { isStandardGaEvent } from "../../constants/standardEvents.ts";

interface EventGridProps {
    events: Event[];
    searchQuery: string;
    selectedTags: string[];
    selectedTypes: string[];
    standardOnly: boolean;
    hideDeprecated: boolean;
    hideUndocumented: boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Event[], Error>>;
}

const EventGrid = ({
    events,
    searchQuery,
    selectedTags,
    selectedTypes,
    standardOnly,
    hideDeprecated,
    hideUndocumented,
    refetch
}: EventGridProps) => {
    const filteredEvents = useMemo(() => {
        return events
            .filter(event =>
                event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter(event => {
                if (selectedTags.length === 0) return true;

                const eventTags = safelyParseJson<string>(event.tags);
                return selectedTags.some(tag => eventTags.includes(tag));
            })
            .filter(event => selectedTypes.length === 0 || selectedTypes.includes(event.type))
            .filter(event => !standardOnly || isStandardGaEvent(event.eventName))
            .filter(event => !hideDeprecated || !event.deprecated)
            .filter(event => !hideUndocumented || !!event.description)
            .sort((a, b) => a.eventName.localeCompare(b.eventName));
    }, [events, searchQuery, selectedTags, selectedTypes, standardOnly, hideDeprecated, hideUndocumented]);

    if (filteredEvents.length === 0) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
                No events match your search criteria
            </Alert>
        );
    }

    return (
        <ScrollArea.Autosize mah="calc(100vh - 170px)" type="auto" offsetScrollbars>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" p="sm">
                {filteredEvents.map(item => (
                    <EventCard
                        key={item.eventName}
                        item={item}
                        refetch={refetch}
                    />
                ))}
            </SimpleGrid>
        </ScrollArea.Autosize>
    );
};

export default EventGrid;
