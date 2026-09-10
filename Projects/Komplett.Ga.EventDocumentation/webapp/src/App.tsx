import React, { useState } from 'react';
import { IconSearch } from "@tabler/icons-react";
import { CloseButton, Container, Grid, Loader, MultiSelect, Stack, Switch, Text, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import Header from "./features/shell/Header.tsx";
import EventGrid from "./features/list/EventGrid.tsx";
import { getEvents } from "./features/list/api/eventRequests.ts";
import { Event } from "./types/Event.ts";
import { safelyParseJson } from "./utils/formatter.ts";

const App = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [standardOnly, setStandardOnly] = useState(false);
    const [hideDeprecated, setHideDeprecated] = useState(false);
    const [hideUndocumented, setHideUndocumented] = useState(false);

    const { data, error, isLoading, refetch } = useQuery<Event[]>({
        queryKey: ["getEvents"],
        queryFn: getEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });

    const updateSearchQuery = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(event.target.value);
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <Container size="xl">
                    <Stack align="center" justify="center" h={300}>
                        <Loader size="lg" />
                        <Text>Loading events...</Text>
                    </Stack>
                </Container>
            </>
        );
    }

    if (error || !data) {
        return (
            <>
                <Header />
                <Container size="xl">
                    <Stack align="center" justify="center" h={300}>
                        <Text c="red" fw={700}>Error loading events</Text>
                        <Text>{error?.message || 'Missing data'}</Text>
                    </Stack>
                </Container>
            </>
        );
    }

    const tags = Array.from(new Set(
        data.flatMap((event) => safelyParseJson<string>(event.tags))
    )).sort();

    const types = Array.from(new Set(
        data.map((event) => event.type).filter((type) => !!type)
    )).sort();

    return (
        <>
            <Header events={data} />
            <Container size="xl">
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
                            <Stack gap="xs">
                                <Switch
                                    checked={standardOnly}
                                    onChange={(event) => setStandardOnly(event.currentTarget.checked)}
                                    label="Standard events only"
                                />
                                <Switch
                                    checked={hideDeprecated}
                                    onChange={(event) => setHideDeprecated(event.currentTarget.checked)}
                                    label="Hide deprecated"
                                />
                                <Switch
                                    checked={hideUndocumented}
                                    onChange={(event) => setHideUndocumented(event.currentTarget.checked)}
                                    label="Hide undocumented"
                                />
                            </Stack>
                            {types.length > 0 && (
                                <MultiSelect
                                    label="Type"
                                    placeholder="Filter by type"
                                    data={types}
                                    value={selectedTypes}
                                    onChange={setSelectedTypes}
                                    clearable
                                    searchable
                                    hidePickedOptions
                                />
                            )}
                            {tags.length > 0 && (
                                <MultiSelect
                                    label="Tags"
                                    placeholder="Filter by tag"
                                    data={tags}
                                    value={selectedTags}
                                    onChange={setSelectedTags}
                                    clearable
                                    searchable
                                    hidePickedOptions
                                />
                            )}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <EventGrid
                            events={data}
                            searchQuery={searchQuery}
                            selectedTags={selectedTags}
                            selectedTypes={selectedTypes}
                            standardOnly={standardOnly}
                            hideDeprecated={hideDeprecated}
                            hideUndocumented={hideUndocumented}
                            refetch={refetch}
                        />
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
};

export default App;
