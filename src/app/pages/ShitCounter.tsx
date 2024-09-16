import { Box, Flex, GridItem, Image, Text, useToast, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { authFetch } from "../helper/authFetch";
import { BACKEND_URL } from "../common/const";
import { useAuth, useAuthDispatch } from "../context/authContext";
import { PopBox } from "./PopBox";
import { IconPooFilled } from "@tabler/icons-react";

export const ShitCounter = (props: any) => {

    const toast = useToast();

    const auth = useAuth();
    const authDispatch = useAuthDispatch();

    const [counter, setCounter] = useState(0);

    const [popBoxOpened, setPopBoxOpened] = useState(false);
    const [lastShitTime, setLastShitTime] = useState("");
    const [lastRandomShitTime, setLastRandomShitTime] = useState("");

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
                if (response.lastShit) {
                    const timeDiff = Date.now() - response.lastShit;
                    let ss = Math.floor(timeDiff / 1000) % 60;
                    let mm = Math.floor(timeDiff / 1000 / 60) % 60;
                    let hh = Math.floor(timeDiff / 1000 / 60 / 60) % 24;
                    let dd = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
                    setLastShitTime(`${dd} 日 ${hh} 鐘頭 \n ${mm} 分鐘 ${ss} 秒`);
                }
                if (response.lastRandomShit) {
                    const timeDiff = Date.now() - response.lastRandomShit;
                    let hh = Math.floor(timeDiff / 1000 / 60 / 60) % 24;
                    setLastRandomShitTime(`${hh} 鐘頭`);
                }
                (response.lastShit || response.lastRandomShit) && setPopBoxOpened(true);
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
        if (auth.auth && auth.user && auth.user.shitCount) {
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
                        zIndex="50"
                        width={150}
                    >
                        <Image src={"poop.png"} />
                    </Box>
                </Flex>
            </GridItem>
            <PopBox isOpen={popBoxOpened} onClose={() => setPopBoxOpened(false)}>
                <VStack
                    spacing={4}
                    align="center"
                    justify="center"
                    p={8}
                >
                    <IconPooFilled color="white" size={50} />
                    <Text
                        color="white"
                        fontSize="xl"
                        fontWeight="bold"
                        textAlign="center"
                    >
                        距離上一次屙屎已經有
                    </Text>
                    <Box
                        bg="white"
                        borderRadius="full"
                        px={6}
                        py={3}
                        boxShadow="md"
                    >
                        <Text
                            color="#5C3A00"
                            fontSize="4xl"
                            fontWeight="extrabold"
                            whiteSpace="pre-line"
                        >
                            {lastShitTime}
                        </Text>
                    </Box>
                    <Text
                        color="yellow.200"
                        fontSize="lg"
                        fontStyle="italic"
                    >
                        要記得多飲水啊！
                    </Text>

                    <Text
                        color="yellow.500"
                        fontSize="md"
                        py="10"
                        fontStyle="italic"
                    >
                        有人喺{lastRandomShitTime}前屙完屎嚟
                    </Text>
                </VStack>
            </PopBox>
        </>
    )
};