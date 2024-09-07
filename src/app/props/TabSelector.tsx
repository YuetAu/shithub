import React from 'react';
import { Box, Flex } from "@chakra-ui/react";
import { IconPooFilled, IconUserFilled } from "@tabler/icons-react";

interface Tab {
    icon: React.ComponentType<any>;
}

const TABS: Tab[] = [
    { icon: IconPooFilled },
    { icon: IconUserFilled },
];

interface TabSelectorProps {
    tab: number;
    setTab: (index: number) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ tab, setTab }) => {
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
            {TABS.map((tabItem, index) => (
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
