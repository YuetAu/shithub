import { Box } from "@chakra-ui/react"
import { IconAwardFilled, IconPooFilled, IconUserFilled } from "@tabler/icons-react"

const TABS = [
    {
        icon: IconPooFilled,
    },
    {
        icon: IconUserFilled,
    }
]

export const TabSelector = (props: any) => {
    return (
        <Box
            shadow={"lg"} rounded={"lg"} px={"1.5em"}
            bgColor={"white"}
            userSelect={"none"}
            //cursor={"pointer"}
            zIndex="99"
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-around"}
            alignItems={"center"}
            gap={"5em"}
        >
            {TABS.map((tab, i) => (
                <Box
                    key={i}
                    onClick={() => props.setTab(i)}
                    cursor={"pointer"}
                    bgColor={props.tab === i ? "gray.200" : "white"}
                    rounded={"lg"}
                    m={"0.5em"}
                >
                    <tab.icon size={50} />
                </Box>
            ))}
        </Box>
    )
}