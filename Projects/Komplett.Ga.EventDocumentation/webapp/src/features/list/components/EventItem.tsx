import { useState } from "react";
import {
    Accordion,
    Badge,
    Button,
    Code,
    Flex,
    Group,
    JsonInput,
    Select,
    Stack, 
    TagsInput,
    Text,
    TextInput,
    ThemeIcon,
    Tooltip
} from "@mantine/core";
import { IconClipboardOff, IconEdit, IconDeviceFloppy } from "@tabler/icons-react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

import { updateEvent } from "../api/eventRequests.ts";
import { Event } from "../../../types/Event.ts";
import { makeJsonNice } from "../../../utils/formatter.ts";
import classes from "./EventItem.module.css";

interface EventItemProps {
    item: Event;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Event[], Error>>;
}

const defaultEventFormObj: Omit<Event, 'eventName'> = { 
    description: '', 
    format: '{}',
    type: '',
    tags: '[]'
};

const EventItem = ({ item, refetch }: EventItemProps) => {
    const [requestLoading, setRequestLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [eventForm, setEventForm] = useState<Event>({
        ...defaultEventFormObj,
        eventName: ''
    });
    
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
    
    const updateTags = (tags: string[]) => {
        const lowercaseTags = tags.map(tag => tag.trim().toLowerCase());
        setEventForm(prev => ({...prev, tags: JSON.stringify(lowercaseTags)}));
    };

    const handleEditMode = () => {
        setEventForm({
            eventName: item.eventName,
            description: item.description || '',
            format: item.format || '{}',
            type: item.type || '',
            tags: item.tags || '[]'
        });
        setIsEditMode(true);
    };
    
    const handleCancelEdit = () => {
        setIsEditMode(false);
    };
    
    const setEventFormState = (state: Partial<Event>) => {
        setEventForm(prev => ({...prev, ...state}));
    };
    
    const safelyParseJson = (jsonString: string, defaultValue: any[] = []): any[] => {
        try {
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : defaultValue;
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return defaultValue;
        }
    };
    
    const Preview = () => (
        <Stack gap="md">
            <Group justify="space-between">
                <div>
                    <Text fw={700} size="md">Event name</Text>
                    <Text>{item.eventName}</Text>
                </div>
                <Tooltip label="Edit documentation">
                    <Button 
                        variant="subtle" 
                        leftSection={<IconEdit size={16} />}
                        onClick={handleEditMode}
                    >
                        Edit
                    </Button>
                </Tooltip>
            </Group>
            
            <div>
                <Text fw={700} size="md">Type</Text>
                {item.type ? 
                    <Badge size="md" radius="sm">{item.type}</Badge> : 
                    <Text c="dimmed" fs="italic">Undocumented</Text>
                }
            </div>
            
            <div>
                <Text fw={700} size="md">Description</Text>
                {item.description ? 
                    <Text>{item.description}</Text> : 
                    <Text c="dimmed" fs="italic">Undocumented</Text>
                }
            </div>
            
            <div>
                <Text fw={700} size="md">Format</Text>
                {item.format ? 
                    <Code block>{makeJsonNice(item.format)}</Code> : 
                    <Text c="dimmed" fs="italic">Undocumented</Text>
                }
            </div>
            
            <div>
                <Text fw={700} size="md">Tags</Text>
                {item.tags && safelyParseJson(item.tags).length > 0 ? 
                    <Group gap={8}>
                        {safelyParseJson(item.tags)
                            .sort()
                            .map((tag: string) => 
                                <Badge key={tag} radius="sm">{tag}</Badge>
                            )}
                    </Group> : 
                    <Text c="dimmed" fs="italic">No tags</Text>
                }
            </div>
        </Stack>
    );

    const Edit = () => (
        <Stack gap="md">
            <div>
                <Text fw={700} size="md">Event name</Text>
                <Text>{item.eventName}</Text>
            </div>
            
            <div>
                <Text fw={700} size="md">Type</Text>
                <Select
                    data={['Clientside', 'Serverside']}
                    placeholder="Select event type"
                    value={eventForm.type}
                    onChange={(option) => setEventFormState({type: option || ''})}
                    radius="md"
                />
            </div>
            
            <div>
                <Text fw={700} size="md">Description</Text>
                <TextInput
                    placeholder="Add a description"
                    value={eventForm.description}
                    onChange={(e) => setEventFormState({description: e.target.value})}
                    radius="md"
                />
            </div>
            
            <div>
                <Text fw={700} size="md">Format</Text>
                <JsonInput
                    validationError="Invalid JSON"
                    formatOnBlur
                    autosize
                    minRows={3}
                    value={eventForm.format}
                    onChange={(value) => setEventFormState({format: value})}
                    radius="md"
                />
            </div>
            
            <div>
                <Text fw={700} size="md">Tags</Text>
                <TagsInput 
                    placeholder="Enter tag and press Enter" 
                    value={safelyParseJson(eventForm.tags)}
                    onChange={updateTags}
                    radius="md"
                />
            </div>
            
            <Flex gap="md" justify="flex-end">
                <Button 
                    variant="subtle" 
                    onClick={handleCancelEdit}
                    disabled={requestLoading}
                >
                    Cancel
                </Button>
                <Button 
                    leftSection={<IconDeviceFloppy size={16} />}
                    onClick={handleUpdateEvent} 
                    loading={requestLoading}
                >
                    Save
                </Button>
            </Flex>
        </Stack>
    );
    
    return (
        <Accordion.Item
            key={item.eventName}
            className={classes.item}
            value={item.eventName}
        >
            <Accordion.Control>
                <Group>
                    {!item.description &&
                        <Tooltip label="Missing documentation">
                            <ThemeIcon
                                color="red"
                                variant="light"
                                size={22}>
                                <IconClipboardOff size={16} stroke={1.5} />
                            </ThemeIcon>
                        </Tooltip>
                    }
                    <Text fw={500}>{item.eventName}</Text>
                    {item.type && <Badge size="sm" radius="sm">{item.type}</Badge>}
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                {isEditMode ? <Edit /> : <Preview />}
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export default EventItem;