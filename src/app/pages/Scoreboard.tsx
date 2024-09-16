import React, { useEffect, useState, useMemo } from 'react';
import { GridItem, VStack, Heading, Box, Text, Flex, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { authFetch } from '../helper/authFetch';
import { BACKEND_URL } from '../common/const';

type ScoreboardItem = {
    shitCount: number;
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
                >
                    <Heading as="h1" size="xl" textAlign="center" letterSpacing="wider" mb={4} color="brown.800">
                        💩 屎屎龍虎榜 💩
                    </Heading>
                    <Box
                        overflowY="auto"
                        flex="1"
                        style={{
                            scrollbarWidth: "none",
                            scrollbarColor: "transparent transparent",
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
                                mb={2}
                                transition="transform 0.2s, box-shadow 0.2s"
                                _hover={{ transform: "scale(0.98)", boxShadow: "lg" }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Text fontSize="2xl" fontWeight="bold" mr={2} color="brown.500">
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold" color="brown.800" noOfLines={1}>
                                        {score.displayName || score.userName}
                                    </Text>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Text fontSize="2xl" fontWeight="bold" color="brown.600" mr={2}>
                                        {score.shitCount}
                                    </Text>
                                    <Text fontSize="2xl">💩</Text>
                                </Box>
                            </Flex>
                        ))}
                    </Box>
                </VStack>
            </Flex>
        </GridItem>
    );
}
