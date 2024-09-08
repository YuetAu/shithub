import React, { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { IconAwardFilled, IconPooFilled, IconUserFilled } from "@tabler/icons-react";
import { useAuth } from '../context/authContext';
import { ShitCounter } from '../pages/ShitCounter';
import { UserInfoPage } from '../pages/UserInfoPage';
import { UserLoginPage } from '../pages/UserLoginPage';

interface Tab {
    icon: React.ComponentType<any>;
    order?: number;
    page: React.ComponentType<any>;
}

interface TabSelectorProps {
    tab: number;
    setTab: (index: number) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ tab, setTab }) => {
    const auth = useAuth();

    const renderTabContent = useCallback(() => {
        return auth.auth ? <UserInfoPage /> : <UserLoginPage />;
    }, [auth.auth]);

    const TABS: Tab[] = [
        { icon: IconPooFilled, order: 1, page: ShitCounter },
        { icon: IconUserFilled, order: 10, page: renderTabContent },
    ];

    const AUTHED_TABS: Tab[] = [
        { icon: IconAwardFilled, order: 2, page: UserInfoPage },
    ];

    const [renderTAB, setRenderTAB] = useState<Tab[]>(TABS);

    useEffect(() => {
        if (auth.auth) {
            setRenderTAB([...TABS, ...AUTHED_TABS].sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
            setRenderTAB(TABS);
        }
    }, [auth.auth]);

    const CurrentTabComponent = renderTAB[tab]?.page;

    return (
        <Grid
            h="100%"
            w="sm"
            m="auto"
            templateRows="repeat(6, 1fr)"
            templateColumns="repeat(1, 1fr)"
            overflow="hidden"
            zIndex={99}
        >
            {CurrentTabComponent && <CurrentTabComponent />}
            <GridItem>
                <Flex
                    shadow="lg"
                    rounded="lg"
                    px="2"
                    py="2"
                    bgColor="white"
                    userSelect="none"
                    zIndex={99}
                    justifyContent="space-between"
                    width={`calc(100% - 5rem)`}
                    m={"auto"}
                    alignItems="center"
                    position="relative"
                >
                    {renderTAB.map((tabItem, index) => (
                        <Box
                            key={index}
                            onClick={() => setTab(index)}
                            cursor="pointer"
                            bgColor={tab === index ? "gray.300" : "white"}
                            rounded="lg"
                            p="2"
                            transition="background-color 0.2s"
                            _hover={{ bgColor: "gray.100" }}
                        >
                            <tabItem.icon size={40} />
                        </Box>
                    ))}
                </Flex>
            </GridItem>
        </Grid>
    );
};