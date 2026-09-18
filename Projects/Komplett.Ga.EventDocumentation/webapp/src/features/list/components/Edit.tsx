import React, { useState } from 'react';
import {
    Button,
    JsonInput,
    Select,
    Stack,
    TagsInput,
    Text,
    Textarea,
    Switch,
    Group
} from "@mantine/core";
import { QueryObserverResult, RefetchOptions}  from "@tanstack/react-query";
import { IconDeviceFloppy } from "@tabler/icons-react";

import { safelyParseJson } from '../../../utils/formatter.ts';
import { updateEvent } from "../api/eventRequests.ts";
import { Event } from "../../../types/Event.ts";
import classes from "./Edit.module.css";

interface EditProps {
    item: Event;
    eventForm: Event;
    setEventForm:  React.Dispatch<React.SetStateAction<Event>>;
    setIsEditMode:  React.Dispatch<React.SetStateAction<boolean>>;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Event[], Error>>;
}

const Edit = ({ item, eventForm, setEventForm, setIsEditMode, refetch }: EditProps) => {
    const [requestLoading, setRequestLoading] = useState(false);
    
    const setEventFormState = (state: Partial<Event>) => {
        setEventForm(prev => ({...prev, ...state}));
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    const updateTags = (tags: string[]) => {
        const lowercaseTags = tags.map(tag => tag.trim().toLowerCase());
        setEventForm(prev => ({...prev, tags: JSON.stringify(lowercaseTags)}));
    };

    const handleUpdateEvent = async () => {
        setRequestLoading(true);

        try {
            const success = await updateEvent(eventForm);
            if (success) {
                setIsEditMode(false);
                await refetch();
            }
        } catch (error) {
            console.error("Failed to update event:", error);
        } finally {
            setRequestLoading(false);
        }
    };
    
    return (
        <Stack gap="md">
            <div>
                <Text fw={700} size="sm">Event name</Text>
                <Text>{item.eventName}</Text>
            </div>

            <div>
                <Text fw={700} size="sm">Type</Text>
                <Select
                    data={['Clientside', 'Serverside']}
                    placeholder="Select event type"
                    value={eventForm.type}
                    onChange={(option) => {
                        const value = option || '';
                        setEventFormState({type: value});
                    }}
                    radius="md"
                />
            </div>

            <div>
                <Text fw={700} size="sm">Description</Text>
                <Textarea
                    radius="md"
                    placeholder="Add a description"
                    value={eventForm.description}
                    onChange={(event) => setEventFormState({description: event.target.value})}
                    minRows={2}
                    autosize
                />
            </div>

            <div>
                <Text fw={700} size="sm">Format</Text>
                <JsonInput
                    radius="sm"
                    minRows={6}
                    maxRows={16}
                    placeholder="Format"
                    value={eventForm.format}
                    onChange={(value) => setEventFormState({format: value})}
                    formatOnBlur
                    autosize
                    classNames={{ input: classes.codeInput }}
                />
            </div>

            <div>
                <Text fw={700} size="sm">Tags</Text>
                <TagsInput
                    placeholder="Enter tag and press Enter"
                    value={safelyParseJson<string>(eventForm.tags)}
                    onChange={updateTags}
                    radius="md"
                />
            </div>
            
            <Group justify="space-between" align="center" mt="md">
                <Switch
                    label="Mark as deprecated"
                    checked={eventForm.deprecated || false}
                    onChange={(event) => setEventFormState({deprecated: event.currentTarget.checked})}
                />
                
                <Group>
                    <Button
                        variant="subtle"
                        onClick={handleCancelEdit}
                        disabled={requestLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        leftSection={<IconDeviceFloppy size={16}/>}
                        onClick={handleUpdateEvent}
                        loading={requestLoading}
                    >
                        Save
                    </Button>
                </Group>
            </Group>
        </Stack>
    );
}

export default Edit;
