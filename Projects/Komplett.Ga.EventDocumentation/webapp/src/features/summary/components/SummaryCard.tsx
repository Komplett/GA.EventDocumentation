import { Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { EventStat } from "../../../types/EventStat.ts";

interface SummaryCardProps {
    eventStat: EventStat;
}

const SummaryCard = ({ eventStat }: SummaryCardProps) => (
    <Paper withBorder p="md" radius="md" key={eventStat.title}>
        <Group justify="apart">
            <ThemeIcon
                color="gray"
                variant="light"
                size={38}
                radius="md"
                style={{ color: eventStat.color }}
            >
                {eventStat.icon}
            </ThemeIcon>

            <div>
                <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                    {eventStat.title}
                </Text>
                <Text fw={700} fz="xl">
                    {eventStat.value}
                </Text>
            </div>
        </Group>
    </Paper>
);

export default SummaryCard;