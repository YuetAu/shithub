import { VStack, Text, Box, Button } from "@chakra-ui/react"
import { IconPooFilled } from "@tabler/icons-react"
import { useEffect, useState } from "react"


export const Survey = (props: any) => {

    const [page, setPage] = useState("SHITTIME")

    useEffect(() => {
        if (props.lastShitTime != "") {
            setPage("SHITTIME")
        } else {
            setPage("SHITSERVEY")
        }
    }, [props.lastShitTime])

    const switchPage = (targetPage: string) => {
        // for conditional check
        setPage(targetPage);
    }

    return (
        <>
            {page === "SHITTIME" && (
                <ShitTimeStat lastShitTime={props.lastShitTime} lastRandomShitTime={props.lastRandomShitTime} switchPage={switchPage} />
            )}
            {page === "SHITSERVEY" && (
                <ShitSurvey />
            )}
        </>
    )
}

export const ShitTimeStat = (props: any) => {
    return (
        <>
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
                    py="10"
                    fontStyle="italic"
                >
                    有人喺{props.lastRandomShitTime}前屙完屎嚟
                </Text>

                {/* <VStack spacing={2} align="center" mt={6}>
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
                    >
                        你嘅回應將用於訓練AI分類唔同類型嘅屎。
                        我哋保證你嘅個人資料絕對保密，
                        未來公開數據時亦會確保匿名性。
                    </Text>
                    <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={props.switchPage("SURVEY")}
                        mt={2}
                    >
                        參與調查
                    </Button>
                </VStack> */}
            </VStack>
        </>
    )
}

export const ShitSurvey = () => {
    return (
        <>
        </>
    )
}