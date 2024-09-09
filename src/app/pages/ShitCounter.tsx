import { Box, Flex, GridItem, Image, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { authFetch } from "../helper/authFetch";
import { BACKEND_URL } from "../common/const";
import { useAuth, useAuthDispatch } from "../context/authContext";

export const ShitCounter = (props: any) => {

    const toast = useToast();

    const auth = useAuth();
    const authDispatch = useAuthDispatch();

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

        const newCounter = counter + 1;
        setCounter(newCounter);

        auth.auth ? (authFetch(`${BACKEND_URL}/shit`, "POST", { time: currentTime }).then((response) => {
            if (response.success) {
                toast({
                    title: "成功",
                    description: "屙咗一波",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
                authDispatch({ type: "SHIT", payload: response.count });
            } else {
                toast({
                    title: "唔好意思",
                    description: "屙唔到",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            }
        })) : unAuthedShit(newCounter);
    };

    const unAuthedShit = (newCounter: number) => {
        localStorage.setItem("unAuthedShit", String(newCounter));
        toast({
            title: "成功",
            description: "登入之後先可以將你啲屎上傳去雲端",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    }

    useEffect(() => {
        if (auth.auth && auth.user.shitCount) {
            setCounter(auth.user.shitCount || 0);
        } else if (!auth.auth) {
            const unAuthedShit = localStorage.getItem("unAuthedShit");
            if (unAuthedShit) {
                setCounter(parseInt(unAuthedShit));
            }
        }
    }, [auth]);

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
                        shadow={"lg"} rounded={"lg"} p={"0.5em"}
                        bgColor={"white"}
                        userSelect={"none"}
                        cursor={"pointer"}
                        onClick={handleCounter}
                        zIndex="99"
                        width={150}
                    >
                        <Image src={"poop.png"} />
                    </Box>
                </Flex>
            </GridItem>
        </>
    )
};