import { useEffect, useRef, useState } from "react";
import { ActionIcon, Alert, Badge, Button, Code, CopyButton, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconAlertTriangle, IconCheck, IconCopy, IconEdit } from "@tabler/icons-react";

import classes from "./EventDetails.module.css";
import { Event } from "../../../types/Event.ts";
import { makeJsonNice, safelyParseJson } from "../../../utils/formatter.ts";

interface EventDetailsProps {
    item: Event;
    onEdit: () => void;
}

const EventDetails = ({ item, onEdit }: EventDetailsProps) => {
    const tags = safelyParseJson<string>(item.tags).sort();
    const formattedValue = item.format ? makeJsonNice(item.format) : "";
    const codeRef = useRef<HTMLElement>(null);
    const [copyButtonOffset, setCopyButtonOffset] = useState(8);

    useEffect(() => {
        const element = codeRef.current;
        if (!element) return;

        setCopyButtonOffset(8 + (element.offsetWidth - element.clientWidth));
    }, [formattedValue]);

    return (
        <Stack gap="md">
            {item.deprecated && (
                <Alert icon={<IconAlertTriangle size={16} />} color="yellow" variant="light">
                    This event is marked as deprecated and should not be used for new implementations.
                </Alert>
            )}

            <Group justify="space-between" align="flex-start">
                <div>
                    <Text fw={700} size="sm">Event name</Text>
                    <Text>{item.eventName}</Text>
                </div>
                <Button variant="light" leftSection={<IconEdit size={16} />} onClick={onEdit}>
                    Edit
                </Button>
            </Group>

            <div>
                <Text fw={700} size="sm">Type</Text>
                {item.type ?
                    <Badge size="md" variant="light">{item.type}</Badge> :
                    <Text c="dimmed" fs="italic">Undocumented</Text>
                }
            </div>

            <div>
                <Text fw={700} size="sm">Description</Text>
                {item.description ?
                    <Text style={{ whiteSpace: "pre-line" }}>{item.description}</Text> :
                    <Text c="dimmed" fs="italic">Undocumented</Text>
                }
            </div>

            <div>
                <Text fw={700} size="sm">Format</Text>
                {item.format ?
                    <div className={classes.formatWrapper}>
                        <Code ref={codeRef} block className={classes.format}>{formattedValue}</Code>
                        <CopyButton value={formattedValue} timeout={1500}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                                    <ActionIcon
                                        className={classes.copyButton}
                                        style={{ right: copyButtonOffset }}
                                        variant="light"
                                        color={copied ? "teal" : "gray"}
                                        onClick={copy}
                                    >
                                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </div> :
                    <Text c="dimmed" fs="italic">Undocumented</Text>
                }
            </div>

            <div>
                <Text fw={700} size="sm">Tags</Text>
                {tags.length > 0 ?
                    <Group gap={8}>
                        {tags.map((tag) => (
                            <Badge key={tag} size="md" variant="light">{tag}</Badge>
                        ))}
                    </Group> :
                    <Text c="dimmed" fs="italic">No tags</Text>
                }
            </div>
        </Stack>
    );
};

export default EventDetails;
