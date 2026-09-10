import { Group, Text, ThemeIcon } from "@mantine/core";
import { IconClipboardOff, IconDatabaseImport, IconFileAnalytics } from "@tabler/icons-react";

import { Event } from "../../../types/Event.ts";

interface HeaderStatsProps {
    events: Event[];
}

const HeaderStats = ({ events }: HeaderStatsProps) => {
    const undocumented = events.filter((event) => !event.description).length;

    const stats = [
        { label: "Undocumented", value: undocumented, icon: IconClipboardOff, color: "red" },
        { label: "Documented", value: events.length - undocumented, icon: IconFileAnalytics, color: "teal" },
        { label: "Total", value: events.length, icon: IconDatabaseImport, color: "blue" }
    ];

    return (
        <Group gap="lg" wrap="nowrap" visibleFrom="sm">
            {stats.map(({ label, value, icon: Icon, color }) => (
                <Group gap={6} wrap="nowrap" key={label}>
                    <ThemeIcon color={color} variant="light" size={20} radius="md">
                        <Icon size={13} stroke={1.5} />
                    </ThemeIcon>
                    <Text size="sm" fw={700}>
                        {value}
                        <Text span size="xs" c="dimmed" fw={500} ml={4}>
                            {label}
                        </Text>
                    </Text>
                </Group>
            ))}
        </Group>
    );
};

export default HeaderStats;
