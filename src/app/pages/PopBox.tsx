import { Box, Button } from "@chakra-ui/react"
import { ShitBackground } from "../props/ShitBackground";


export const PopBox = (props: any) => {
    return (
        <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            height="100%"
            width="sm"
            margin="auto"
            zIndex={1000}
            display={props.isOpen ? "block" : "none"}
        >
            <ShitBackground />
            <Button
                position="absolute"
                top="1rem"
                right="1rem"
                onClick={props.onClose}
            >
                Close
            </Button>
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                zIndex={1000}
            >
                {props.children}
            </Box>
        </Box>
    );
}