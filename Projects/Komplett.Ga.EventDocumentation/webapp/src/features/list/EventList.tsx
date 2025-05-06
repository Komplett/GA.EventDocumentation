import { useMemo } from "react";
import { Accordion, Alert, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IconAlertCircle } from "@tabler/icons-react";

import { getEvents } from "./api/eventRequests.ts";
import EventItem from "./components/EventItem.tsx";
import { Event } from "../../types/Event.ts";

interface EventListProps {
    searchQuery: string;
    tagQuery: string;
}

const EventList = ({ searchQuery, tagQuery }: EventListProps) => {
    const { data, error, isLoading, refetch } = useQuery<Event[]>({
        queryKey: ["getEvents"],
        queryFn: getEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes - same as in App.tsx
    });
    
    const filteredEvents = useMemo(() => {
        if (!data) return [];
        
        return data
            .filter(event => 
                event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter(event => {
                if (!tagQuery) return true;
                
                try {
                    if (!event.tags) return false;
                    const tags = JSON.parse(event.tags);
                    return Array.isArray(tags) && tags.includes(tagQuery);
                } catch (error) {
                    console.error("Error parsing tags:", error);
                    return false;
                }
            })
            .sort((a, b) => a.eventName.localeCompare(b.eventName));
    }, [data, searchQuery, tagQuery]);

    if (isLoading) {
        return (
            <Stack align="center" p="md">
                <Loader size="sm" />
                <Text size="sm">Loading events...</Text>
            </Stack>
        );
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error.message || 'Error: Failed to load events'}
            </Alert>
        );
    }

    if (!data) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="gray">
                No events found
            </Alert>
        );
    }

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