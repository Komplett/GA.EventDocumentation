import React, { useState } from 'react';
import { IconSearch } from "@tabler/icons-react";
import { Badge, Container, Group, Loader, Stack, Text, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import EventSummary from "./features/summary/EventSummary.tsx";
import EventList from "./features/list/EventList.tsx";
import { getEvents } from "./features/list/api/eventRequests.ts";
import { Event } from "./types/Event.ts";

const App = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [tagQuery, setTagQuery] = useState("");

    const { data, error, isLoading } = useQuery<Event[]>({
        queryKey: ["getEvents"],
        queryFn: getEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });

    const updateSearchQuery = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(event.target.value);
    };
    
    const updateSelectedTag = (tag: string) => {
        setTagQuery(prevTag => prevTag !== tag ? tag : "");
    };

    if (isLoading) {
        return (
            <Container size="md">
                <Stack align="center" justify="center" h={300}>
                    <Loader size="lg" />
                    <Text>Loading events...</Text>
                </Stack>
            </Container>
        );
    }

    if (error || !data) {
        return (
            <Container size="md">
                <Stack align="center" justify="center" h={300}>
                    <Text c="red" fw={700}>Error loading events</Text>
                    <Text>{error?.message || 'Missing data'}</Text>
                </Stack>
            </Container>
        );
    }
    
    const tags = Array.from(new Set(
        data.reduce<string[]>((acc, event) => {
            if (event?.tags) {
                try {
                    const parsedTags = JSON.parse(event.tags);
                    if (Array.isArray(parsedTags)) {
                        return acc.concat(parsedTags);
                    }
                } catch (error) {
                    console.error("Error parsing tags:", error);
                }
            }
            return acc;
        }, [])
    )).sort();
    
    return (
        <Container size="md">
            <Stack gap="xl">
                <EventSummary />
                <TextInput
                    value={searchQuery}
                    onChange={updateSearchQuery}
                    placeholder="Search for event name..." 
                    rightSection={<IconSearch size={16} />} 
                    aria-label="Search for events"
                />
                {tags.length > 0 && (
                    <div>
                        <Text fw={500} mb="xs">Filter by tag:</Text>
                        <Group gap={8}>
                            {tags.map((tag) => (
                                <Badge 
                                    key={tag}
                                    style={{ cursor: "pointer" }}
                                    variant="light"
                                    color={tagQuery === tag ? "green" : "blue"}
                                    onClick={() => updateSelectedTag(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </Group>
                    </div>
                )}
                <EventList searchQuery={searchQuery} tagQuery={tagQuery} />
            </Stack>
        </Container>
    );
};

export default App;
