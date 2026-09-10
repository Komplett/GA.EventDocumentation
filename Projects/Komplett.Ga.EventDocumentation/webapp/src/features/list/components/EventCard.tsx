import { useState } from "react";
import {
    Badge,
    Card,
    Group,
    Modal,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from "@mantine/core";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import {
    IconAlertTriangle,
    IconBrowser,
    IconClipboardOff,
    IconServer
} from "@tabler/icons-react";

import classes from "./EventCard.module.css";
import Edit from "./Edit.tsx";
import EventDetails from "./EventDetails.tsx";
import { Event } from "../../../types/Event.ts";
import { makeJsonNice, safelyParseJson } from "../../../utils/formatter.ts";

interface EventCardProps {
    item: Event;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Event[], Error>>;
}

const TYPE_ICONS: Record<string, typeof IconBrowser> = {
    clientside: IconBrowser,
    serverside: IconServer
};

const defaultEventFormObj: Omit<Event, "eventName"> = {
    description: "",
    format: "{}",
    type: "",
    tags: "[]",
    deprecated: false
};

const EventCard = ({ item, refetch }: EventCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [eventForm, setEventForm] = useState<Event>({
        ...defaultEventFormObj,
        eventName: ""
    });

    const tags = safelyParseJson<string>(item.tags).sort();
    const isUndocumented = !item.description && !item.deprecated;
    const TypeIcon = item.type ? TYPE_ICONS[item.type.toLowerCase()] : undefined;

    const handleOpenModal = () => {
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
    };

    const handleEnterEditMode = () => {
        setEventForm({
            eventName: item.eventName,
            description: item.description || "",
            format: makeJsonNice(item.format || "{}"),
            type: item.type || "",
            tags: item.tags || "[]",
            deprecated: item.deprecated || false
        });
        setIsEditMode(true);
    };

    return (
        <>
            <Card
                radius="md"
                padding="lg"
                className={classes.card}
                onClick={handleOpenModal}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOpenModal();
                    }
                }}
            >
                <Stack gap="sm" h="100%">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Text fw={600} style={{ wordBreak: "break-word" }}>
                            {item.eventName}
                        </Text>
                        <Group gap={6} wrap="nowrap">
                            {TypeIcon && (
                                <Tooltip label={item.type}>
                                    <ThemeIcon color="blue" variant="light" size={20}>
                                        <TypeIcon size={14} stroke={1.5} />
                                    </ThemeIcon>
                                </Tooltip>
                            )}
                            {item.deprecated && (
                                <Tooltip label="Deprecated">
                                    <ThemeIcon color="yellow" variant="light" size={20}>
                                        <IconAlertTriangle size={14} stroke={1.5} />
                                    </ThemeIcon>
                                </Tooltip>
                            )}
                            {isUndocumented && (
                                <Tooltip label="Missing documentation">
                                    <ThemeIcon color="red" variant="light" size={20}>
                                        <IconClipboardOff size={14} stroke={1.5} />
                                    </ThemeIcon>
                                </Tooltip>
                            )}
                        </Group>
                    </Group>

                    <Text
                        size="sm"
                        c={item.description ? undefined : "dimmed"}
                        fs={item.description ? undefined : "italic"}
                        lineClamp={5}
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {item.description || "Undocumented"}
                    </Text>

                    <Group gap={6} mt="auto" pt="xs">
                        {tags.map((tag) => (
                            <Badge key={tag} size="xs" variant="light" color="gray">
                                {tag}
                            </Badge>
                        ))}
                    </Group>
                </Stack>
            </Card>

            <Modal
                opened={isModalOpen}
                onClose={handleCloseModal}
                title={<Text fw={700}>{item.eventName}</Text>}
                size="lg"
            >
                {isEditMode ? (
                    <Edit
                        item={item}
                        eventForm={eventForm}
                        setEventForm={setEventForm}
                        setIsEditMode={setIsEditMode}
                        refetch={refetch}
                    />
                ) : (
                    <EventDetails item={item} onEdit={handleEnterEditMode} />
                )}
            </Modal>
        </>
    );
};

export default EventCard;
