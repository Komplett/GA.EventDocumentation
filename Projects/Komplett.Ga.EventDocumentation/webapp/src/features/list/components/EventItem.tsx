import { useState } from "react";
import {
    Accordion,
    Badge,
    Group,
    Text,
    ThemeIcon,
    Tooltip
} from "@mantine/core";
import { IconClipboardOff } from "@tabler/icons-react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

import { Event } from "../../../types/Event.ts";
import classes from "./EventItem.module.css";
import Edit from "./Edit.tsx";
import Preview from "./Preview.tsx";

interface EventItemProps {
    item: Event;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Event[], Error>>;
}

const defaultEventFormObj: Omit<Event, 'eventName'> = { 
    description: '', 
    format: '{}',
    type: '',
    tags: '[]',
    deprecated: false
};

const EventItem = ({ item, refetch }: EventItemProps) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [eventForm, setEventForm] = useState<Event>({
        ...defaultEventFormObj,
        eventName: ''
    });
    
    return (
        <Accordion.Item
            key={item.eventName}
            className={classes.item}
            value={item.eventName}
        >
            <Accordion.Control>
                <Group gap="xs">
                    {(!item.description && !item.deprecated) &&
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
                    {item.type && <Badge size="sm" variant="light">{item.type}</Badge>}
                    {item.deprecated && <Badge size="sm" variant="light" color="yellow">Deprecated</Badge>}
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                {isEditMode ? 
                    <Edit 
                        eventForm={eventForm}
                        setEventForm={setEventForm}
                        item={item}
                        setIsEditMode={setIsEditMode}
                        refetch={refetch}
                    /> : 
                    <Preview
                        item={item}
                        setEventForm={setEventForm}
                        setIsEditMode={setIsEditMode}
                    />
                }
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export default EventItem;