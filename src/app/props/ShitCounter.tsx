import { Box, Flex, GridItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";

export const ShitCounter = (props: any) => {

    const [counter, setCounter] = useState(0);

    return (
        <>
            <GridItem rowSpan={2}>
                <Flex h={"100%"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                    <Text textColor={"white"} fontSize={"50"} fontWeight={"700"} zIndex="99">你今日屙咗未?</Text>
                </Flex>
            </GridItem>
            <GridItem>
                <Flex h={"100%"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                    <Text textColor={"white"} fontSize={"100"} fontWeight={"1000"} zIndex="99">{counter}</Text>
                </Flex>
            </GridItem>
            <GridItem rowSpan={2}>
                <Flex h={"100%"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                    <Box
                        shadow={"lg"} rounded={"lg"} px={"1.5em"}
                        bgColor={"white"}
                        userSelect={"none"}
                        cursor={"pointer"}
                        onClick={() => setCounter(prev => prev + 1)}
                        zIndex="99"
                    >
                        <Text textColor={"white"} fontSize={"100"}>💩</Text>
                    </Box>
                </Flex>
            </GridItem>
        </>
    )
};