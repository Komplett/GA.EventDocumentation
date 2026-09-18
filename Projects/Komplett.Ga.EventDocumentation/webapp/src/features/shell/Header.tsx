import classes from './Header.module.css';
import { Container, Group, Title } from '@mantine/core';

import HeaderStats from "../summary/components/HeaderStats.tsx";
import { Event } from "../../types/Event.ts";

interface HeaderProps {
    events?: Event[];
}

const Header = ({ events }: HeaderProps) => {
    return (
        <header className={classes.header}>
            <Container size="xl" className={classes.inner}>
                <Title order={4}>GA Event Documentation</Title>
                <div className={classes.stats}>
                    {events && <HeaderStats events={events} />}
                </div>
                <Group gap={5}>
                    <a
                        href="#"
                        className={classes.link}
                        data-active={true}
                        aria-current="page"
                    >
                        Documentation
                    </a>
                </Group>
            </Container>
        </header>
    );
};

export default Header;
