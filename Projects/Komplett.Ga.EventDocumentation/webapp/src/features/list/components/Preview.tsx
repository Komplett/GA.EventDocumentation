import React from "react";

import {
    Alert,
    Badge, 
    Button, 
    Code, 
    Group, 
    Stack, 
    Text, 
    Tooltip
} from "@mantine/core";
import { IconEdit, IconAlertTriangle } from "@tabler/icons-react";

import { makeJsonNice, safelyParseJson } from "../../../utils/formatter.ts";
import { Event } from "../../../types/Event.ts";

interface PreviewProps {
    item: Event;
    setEventForm: React.Dispatch<React.SetStateAction<Event>>;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Preview = ({ item, setEventForm, setIsEditMode}: PreviewProps) => {

    const handleEditMode = () => {
        const formState = {
            eventName: item.eventName,
            description: item.description || '',
            format: item.format || '{}',
            type: item.type || '',
            tags: item.tags || '[]',
            deprecated: item.deprecated || false
        };

        setEventForm(formState);
        setIsEditMode(true);
    };
    
    return (
        <Stack gap="md">
            {item.deprecated && (
                <Alert 
                    icon={<IconAlertTriangle size={16} />}
                    color="yellow" 
                    variant="light"
                >
                    This event is marked as deprecated and should not be used for new implementations.
                </Alert>
            )}
            
            <Group justify="space-between">
                <div>
                    <Text fw={700} size="md">Event name</Text>
                    <Text>{item.eventName}</Text>
                </div>
                <Tooltip label="Edit documentation">
                    <Button
                        variant="subtle"
                        leftSection={<IconEdit size={16}/>}
                        onClick={handleEditMode}
                    >
                        Edit
                    </Button>
                </Tooltip>
            </Group>

            <div>
                <Text fw={700} size="md">Type</Text>
                {item.type ?
                    <Badge size="md" variant="light">{item.type}</Badge> :
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
                                <Badge key={tag} size="md" variant="light">{tag}</Badge>
                            )}
                    </Group> :
                    <Text c="dimmed" fs="italic">No tags</Text>
                }
            </div>
        </Stack>
    );
}

export default Preview;