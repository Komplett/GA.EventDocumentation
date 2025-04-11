import classes from './Header.module.css';
import { Container, Group, Title } from '@mantine/core';

const Header = () => {
    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner}>
                <Title order={4}>GA Event Documentation</Title>
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