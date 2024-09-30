import React, { useEffect, useState, useMemo } from 'react';
import { GridItem, VStack, Heading, Box, Text, Flex, Spinner, Alert, AlertIcon, HStack } from "@chakra-ui/react";
import { authFetch } from '../helper/authFetch';
import { BACKEND_URL } from '../common/const';

type ScoreboardItem = {
    shitCount: number;
    superShitCount: number;
    userName: string;
    displayName: string;
}

export const ScoreboardPage = () => {
    const [scores, setScores] = useState<ScoreboardItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScoreboard = async () => {
            try {
                setIsLoading(true);
                const res = await authFetch(`${BACKEND_URL}/shit/scoreboard`, "GET");
                console.log("Successfully fetched scoreboard");
                if (!res.success || !res.scoreboard) throw new Error("Unable to Load")
                setScores(res.scoreboard);
                setError(null);
            } catch (err) {
                console.error("Error fetching scoreboard:", err);
                setError("Failed to load scoreboard. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchScoreboard();
    }, []);

    const sortedScores = useMemo(() => {
        return [...scores].sort((a, b) => b.shitCount - a.shitCount);
    }, [scores]);

    if (isLoading) {
        return (
            <GridItem rowSpan={5} display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" color="brown.500" />
            </GridItem>
        );
    }

    if (error) {
        return (
            <GridItem rowSpan={5}>
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            </GridItem>
        );
    }

    return (
        <GridItem rowSpan={5} overflowY="auto">
            <Flex
                h={"100%"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}
            >
                <VStack
                    spacing={4}
                    align="stretch"
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(10px)"
                    p={6}
                    height={"90%"}
                    overflowX={"visible"}
                    borderRadius="lg"
                    boxShadow="xl"
                    position="relative"
                    zIndex={10}
                    width="100%"
                >
                    <Heading as="h1" size="xl" textAlign="center" letterSpacing="wider" mb={2} color="brown.800">
                        💩 屎屎龍虎榜 💩
                        <Text fontSize={"sm"} mt={1} color="gray.600">只統計當月屎屎</Text>
                    </Heading>

                    <Box
                        overflowY="auto"
                        flex="1"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(0,0,0,0.1) transparent",
                        }}
                    >
                        {sortedScores.map((score, index) => (
                            <Flex
                                key={score.userName}
                                justify="space-between"
                                align="center"
                                bg={index === 0 ? "yellow.100" : index === 1 ? "gray.100" : index === 2 ? "orange.100" : "white"}
                                p={4}
                                borderRadius="md"
                                boxShadow="md"
                                mb={3}
                                transition="transform 0.2s, box-shadow 0.2s"
                                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                            >
                                <Flex align="center" flex={1}>
                                    <Text fontSize="2xl" fontWeight="bold" mr={3} color={index < 3 ? "gold" : "gray.400"}>
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                                    </Text>
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xl" fontWeight="bold" color="brown.800" noOfLines={1} textAlign={"start"}>
                                            {score.displayName || score.userName}
                                        </Text>
                                    </VStack>
                                </Flex>
                                <Flex align="center" justify="flex-end" ml={2}>
                                    <VStack spacing={1} align="end">
                                        <Flex align="center">
                                            <Text fontSize="lg" fontWeight="bold" color="brown.600" mr={1}>
                                                {score.shitCount}
                                            </Text>
                                            <Text fontSize="lg" display={"inline-block"}>💩</Text>
                                        </Flex>
                                        <Flex align="center">
                                            <Text fontSize="sm" fontWeight="bold" color="orange.500" mr={1}>
                                                {score.superShitCount || 0}
                                            </Text>
                                            <Text fontSize="sm" className="golden-poop">💩</Text>
                                        </Flex>
                                    </VStack>
                                </Flex>
                            </Flex>
                        ))}
                        {sortedScores.length === 0 && (
                            <Text textAlign="center" color="gray.700" fontSize="lg" my="auto">
                                啱啱沖完廁🚽 仲未有屎住
                            </Text>
                        )}
                    </Box>
                </VStack>
            </Flex>
        </GridItem>
    );
}
