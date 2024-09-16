import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ShitBackground } from "../props/ShitBackground";

export const PopBox = (props: any) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        if (props.isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsContentVisible(true), 500); // Delay content reveal
        } else {
            setIsContentVisible(false);
            setTimeout(() => setIsVisible(false), 1000); // Delay hiding the box
        }
    }, [props.isOpen]);

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
            opacity={isVisible ? 1 : 0}
            visibility={isVisible ? "visible" : "hidden"}
            transition="opacity 1s ease, visibility 1s ease"
        >
            <ShitBackground />
            <Button
                position="absolute"
                top="1rem"
                right="1rem"
                zIndex={1000}
                onClick={props.onClose}
                opacity={isContentVisible ? 1 : 0}
                transition="opacity 1s ease"
            >
                關閉
            </Button>
            <Box
                position="absolute"
                top="50%"
                left="50%"
                width={"sm"}
                transform={`translate(-50%, -50%) scale(${isContentVisible ? 1 : 0.8})`}
                opacity={isContentVisible ? 1 : 0}
                zIndex={1000}
                transition="opacity 1s ease, transform 1s ease"
            >
                {props.children}
            </Box>
        </Box>
    );
};
