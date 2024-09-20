import React, { useState } from 'react';
import {
    VStack,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Box,
    Flex,
    Button,
    Image,
    Tooltip
} from '@chakra-ui/react';
import { IconInfoCircle } from '@tabler/icons-react';

const bristolStoolTypes = [
    { value: 1, label: '堅硬的顆粒', description: '單獨的硬塊，像堅果（難以排出）' },
    { value: 2, label: '腸形狀', description: '形狀如香腸但結塊的' },
    { value: 3, label: '表面有裂縫', description: '像香腸但表面有裂縫' },
    { value: 4, label: '光滑和軟', description: '像香腸或蛇一樣光滑和軟' },
    { value: 5, label: '軟塊', description: '軟塊，邊緣清晰（容易排出）' },
    { value: 6, label: '糊狀', description: '糊狀、邊緣不規則' },
    { value: 7, label: '完全液體', description: '完全液體，沒有固體片段' },
];

const tooltipContent = `
布里斯托糞便量表（Bristol Stool Scale）是一種醫學評估工具，用於分類人類糞便的形狀和稠度。
`;

export const BristolStoolChartSlider = ({ onSubmit }: { onSubmit: any }) => {
    const [stoolType, setStoolType] = useState(4);

    const handleChange = (value: any) => {
        setStoolType(value);
    };

    return (
        <VStack
            spacing={6}
            align="stretch"
            bg="blue.900"
            p={6}
            borderRadius="md"
            width="100%"
            maxWidth="400px"
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Text color="white" fontWeight="bold" fontSize="xl">
                    Bristol Stool Chart
                </Text>
                <Tooltip label={tooltipContent} placement={"top"} hasArrow>
                    <Button variant="ghost" size="sm" leftIcon={<IconInfoCircle />} color="white">
                        Info
                    </Button>
                </Tooltip>
            </Flex>

            <Slider
                min={1}
                max={7}
                step={1}
                value={stoolType}
                onChange={handleChange}
            >
                <SliderTrack bg="blue.700">
                    <SliderFilledTrack bg="yellow.400" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
            </Slider>

            <Flex justifyContent="space-between">
                {bristolStoolTypes.map((type) => (
                    <Box
                        key={type.value}
                        width="2px"
                        height={type.value === stoolType ? "20px" : "10px"}
                        bg={type.value === stoolType ? "yellow.400" : "blue.700"}
                    />
                ))}
            </Flex>

            <Box bg="blue.800" p={4} borderRadius="md">
                <Flex alignItems="center">
                    <Image
                        src={`/stool-scale/type${stoolType}.png`}
                        alt={`Type ${stoolType} stool`}
                        boxSize="60px"
                        mr={4}
                    />
                    <Box>
                        <Text color="white" fontWeight="bold" fontSize="lg">
                            {stoolType} - {bristolStoolTypes[stoolType - 1].label}
                        </Text>
                        <Text color="gray.300" fontSize="sm" mt={2}>
                            {bristolStoolTypes[stoolType - 1].description}
                        </Text>
                    </Box>
                </Flex>
            </Box>

            <Button colorScheme="yellow" onClick={() => onSubmit(stoolType)}>
                Update
            </Button>
        </VStack>
    );
};
