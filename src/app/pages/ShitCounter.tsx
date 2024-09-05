import { Box, Flex, GridItem, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";

export const ShitCounter = (props: any) => {

    const toast = useToast();

    const [counter, setCounter] = useState(0);

    const handleCounter = () => {
        const currentTime = Date.now();
        const lastTime = localStorage.getItem("lastTime");
        if (lastTime) {
            const diff = currentTime - parseInt(lastTime);
            if (diff < 1000 * 60 * 30) {
                toast({
                    title: "你屙得太快啦",
                    description: "休息一下再試吓啦",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
                return;
            }
        }
        localStorage.setItem("lastTime", currentTime.toString());
        setCounter(counter + 1);
    };

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
                        onClick={handleCounter}
                        zIndex="99"
                    >
                        <Text textColor={"white"} fontSize={"100"}>💩</Text>
                    </Box>
                </Flex>
            </GridItem>
        </>
    )
};