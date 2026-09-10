import React, { useState } from 'react';
import { IconSearch } from "@tabler/icons-react";
import { Button, Checkbox, CloseButton, Container, Grid, Group, Loader, Stack, Switch, Text, TextInput, UnstyledButton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import classes from "./App.module.css";
import EventSummary from "./features/summary/EventSummary.tsx";
import EventGrid from "./features/list/EventGrid.tsx";
import { getEvents } from "./features/list/api/eventRequests.ts";
import { Event } from "./types/Event.ts";
import { safelyParseJson } from "./utils/formatter.ts";

const App = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [standardOnly, setStandardOnly] = useState(false);

    const { data, error, isLoading, refetch } = useQuery<Event[]>({
        queryKey: ["getEvents"],
        queryFn: getEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });

    const updateSearchQuery = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(event.target.value);
    };

    const toggleSelectedTag = (tag: string) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    };

    if (isLoading) {
        return (
            <Container size="xl">
                <Stack align="center" justify="center" h={300}>
                    <Loader size="lg" />
                    <Text>Loading events...</Text>
                </Stack>
            </Container>
        );
    }

    if (error || !data) {
        return (
            <Container size="xl">
                <Stack align="center" justify="center" h={300}>
                    <Text c="red" fw={700}>Error loading events</Text>
                    <Text>{error?.message || 'Missing data'}</Text>
                </Stack>
            </Container>
        );
    }

    const tags = Array.from(new Set(
        data.flatMap((event) => safelyParseJson<string>(event.tags))
    )).sort();

    return (
        <Container size="xl">
            <Stack gap="xl">
                <EventSummary events={data} />
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 3 }}>
                        <Stack gap="lg">
                            <TextInput
                                value={searchQuery}
                                onChange={updateSearchQuery}
                                placeholder="Search for event name..."
                                rightSection={
                                    searchQuery ? (
                                        <CloseButton
                                            size="sm"
                                            onClick={() => setSearchQuery("")}
                                            aria-label="Clear search"
                                        />
                                    ) : (
                                        <IconSearch size={16} />
                                    )
                                }
                                rightSectionPointerEvents={searchQuery ? "auto" : "none"}
                                aria-label="Search for events"
                            />
                            <Switch
                                checked={standardOnly}
                                onChange={(event) => setStandardOnly(event.currentTarget.checked)}
                                label="Standard events only"
                            />
                            {tags.length > 0 && (
                                <Stack gap={2}>
                                    <Group justify="space-between" align="center" mb={4}>
                                        <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                                            Tags
                                        </Text>
                                        <Button
                                            variant="subtle"
                                            size="compact-xs"
                                            disabled={selectedTags.length === 0}
                                            onClick={() => setSelectedTags([])}
                                        >
                                            Clear
                                        </Button>
                                    </Group>
                                    <Stack gap={2}>
                                        {tags.map((tag) => {
                                            const isSelected = selectedTags.includes(tag);
                                            return (
                                                <UnstyledButton
                                                    key={tag}
                                                    onClick={() => toggleSelectedTag(tag)}
                                                    className={`${classes.tagRow} ${isSelected ? classes.tagRowSelected : ""}`}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => {}}
                                                        tabIndex={-1}
                                                        size="sm"
                                                        style={{ pointerEvents: "none" }}
                                                    />
                                                    <Text className={classes.tagLabel}>{tag}</Text>
                                                </UnstyledButton>
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <EventGrid
                            events={data}
                            searchQuery={searchQuery}
                            selectedTags={selectedTags}
                            standardOnly={standardOnly}
                            refetch={refetch}
                        />
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    );
};

export default App;
