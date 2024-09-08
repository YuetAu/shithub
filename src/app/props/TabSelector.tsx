import React, { useEffect } from 'react';
import { Box, Flex } from "@chakra-ui/react";
import { IconAwardFilled, IconPooFilled, IconUserFilled } from "@tabler/icons-react";
import { useAuth } from '../context/authContext';

interface Tab {
    icon: React.ComponentType<any>;
    order?: number;
}

const TABS: Tab[] = [
    { icon: IconPooFilled, order: 1 },
    { icon: IconUserFilled, order: 10 },
];

const AUTHED_TABS: Tab[] = [
    { icon: IconAwardFilled, order: 2 },
]

interface TabSelectorProps {
    tab: number;
    setTab: (index: number) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ tab, setTab }) => {

    const auth = useAuth();

    const [renderTAB, setRenderTAB] = React.useState<Tab[]>(TABS);

    useEffect(() => {
        if (auth.auth) {
            setRenderTAB([...TABS, ...AUTHED_TABS].sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
            setRenderTAB(TABS);
        }
    }, [auth]);



    return (
        <Flex
            shadow="lg"
            rounded="lg"
            px="1.5em"
            bgColor="white"
            userSelect="none"
            zIndex={99} // Increased z-index
            justifyContent="space-around"
            alignItems="center"
            gap="5rem"
            position="relative" // Added position relative
        >
            {renderTAB.map((tabItem, index) => (
                <Box
                    key={index}
                    onClick={() => setTab(index)}
                    cursor="pointer"
                    bgColor={tab === index ? "gray.200" : "white"}
                    rounded="lg"
                    m="0.5em"
                    transition="background-color 0.2s"
                    _hover={{ bgColor: "gray.100" }}
                >
                    <tabItem.icon size={50} />
                </Box>
            ))}
        </Flex>
    );
};
