import { VStack, Text, Box, Button, Checkbox, HStack, useTab, useToast } from "@chakra-ui/react"
import { IconDatabase, IconPooFilled, IconShieldLock, IconUserCircle } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { BristolStoolChartSlider } from "../props/ScaleSelector"
import { authFetch } from "../helper/authFetch"
import { BACKEND_URL } from "../common/const"


export const Survey = (props: any) => {

    const [page, setPage] = useState(0)

    useEffect(() => {
        console.log(props.lastShitTime, page, props.lastShitTime === "")
        if (props.lastShitTime === "") {
            setPage(1)
        } else if (props.lastShitTime !== "") {
            setPage(0)
        }
    }, [props.isOpen, props.lastShitTime])

    const switchPage = (targetPage: number) => {
        // for conditional check
        setPage(targetPage);
    }

    const handleUpdateShit = (data: any) => authFetch(`${BACKEND_URL}/shit`, "PATCH", { shitID: props.newShitIDRef.current, data: { extraData: JSON.stringify(data) } })

    return (
        <>
            {page === 0 && (
                <ShitTimeStat lastShitTime={props.lastShitTime} lastRandomShitTime={props.lastRandomShitTime} switchPage={switchPage} />
            )}
            {page === 1 && (
                <ShitInviteSurvey switchPage={switchPage} />
            )}
            {page === 2 && (
                <ShitSurvey switchPage={switchPage} handleUpdateShit={handleUpdateShit} setOpen={props.setOpen} />
            )}
        </>
    )
}

export const ShitTimeStat = (props: any) => {
    return (
        <>
            <VStack
                spacing={2}
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
                        textAlign="center"
                    >
                        {props.lastShitTime}
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
                    fontStyle="italic"
                >
                    有人喺{props.lastRandomShitTime}前屙完屎嚟
                </Text>

                <Box
                    bg="whiteAlpha.200"
                    borderRadius="lg"
                    p={4}
                    mt={4}
                    flex={"1"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    textAlign={"center"}
                >
                    <Text
                        color="white"
                        fontSize="sm"
                        textAlign="center"
                    >
                        想做個良好屎民？幫我哋填下屙屎體驗調查！
                    </Text>
                    <Text
                        color="gray.300"
                        fontSize="xs"
                        textAlign="center"
                        whiteSpace="pre-line"
                    >
                        {`你嘅回應將用於訓練AI分類唔同類型嘅屎。 
                    我哋保證你嘅個人資料絕對保密，
                    未來公開數據時亦會確保匿名性。`}
                    </Text>
                    <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => props.switchPage(2)}
                        mt={2}
                    >
                        參與調查
                    </Button>
                </Box>
            </VStack>
        </>
    )
}

export const ShitInviteSurvey = (props: any) => {
    return (
        <VStack
            spacing={6}
            align="center"
            justify="center"
            p={8}
        >
            <IconPooFilled color="white" size={70} />
            <Text
                color="white"
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
            >
                歡迎加入屙屎俱樂部！
            </Text>
            <Box
                bg="whiteAlpha.200"
                borderRadius="lg"
                p={4}
                mt={4}
                flex={"1"}
                justifyContent={"center"}
                alignContent={"center"}
                textAlign={"center"}
            >
                <Text
                    color="white"
                    fontSize="sm"
                    textAlign="center"
                >
                    想做個良好屎民？幫我哋填下屙屎體驗調查！
                </Text>
                <Text
                    color="gray.300"
                    fontSize="xs"
                    textAlign="center"
                    whiteSpace="pre-line"
                >
                    {`你嘅回應將用於訓練AI分類唔同類型嘅屎。 
                    我哋保證你嘅個人資料絕對保密，
                    未來公開數據時亦會確保匿名性。`}
                </Text>
                <Button
                    colorScheme="yellow"
                    size="sm"
                    onClick={() => props.switchPage(2)}
                    mt={2}
                >
                    參與調查
                </Button>
            </Box>
        </VStack>
    )
}

export const ShitSurvey = (props: any) => {

    const toast = useToast()

    const handleSubmit = (value: any) => {
        props.handleUpdateShit({ reportedType: value }).then(() => {
            toast({
                title: "成功",
                description: "你嘅回應已經提交！",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            props.switchPage(0)
            props.setOpen(false)
        }).catch((err: any) => {
            console.error(err)
            toast({
                title: "唔好意思👷😢",
                description: "提交唔到回應",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        })
    };

    return (
        <>
            <BristolStoolChartSlider onSubmit={handleSubmit} />
        </>
    )
}