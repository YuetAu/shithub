import { Box } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { float, flyAcross } from "../styles/keyframes";


export const ShitBackground = (props: any) => {
    const randomArray = useMemo(() => {
        return Array.from({ length: 10 }, () => [Math.random(), Math.random(), Math.random()]);
    }, []);

    return (
        <React.Fragment>
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                opacity="0.1"
                backgroundImage={"url('/poop.svg')"}
                backgroundRepeat="repeat"
                zIndex="1"
            />

            {randomArray.map((r, i) => (
                <Box
                    key={i + Date.now()}
                    position="absolute"
                    top={`${r[0] * 100}%`}
                    left={`${r[1] * 100}%`}
                    fontSize={`${r[2] * 30 + 20}px`}
                    opacity="0.3"
                    animation={`${float} ${r[1] * r[2] / r[0] * 3 + 2}s ease-in-out infinite`}
                    zIndex="2"
                    userSelect={"none"}
                >
                    💩
                </Box>
            ))}

            {/* Flying poops */}
            {randomArray.map((r, i) => (
                <Box
                    key={i + Date.now()}
                    position="absolute"
                    bottom={`${r[0] * props.containerHeight}px`} // Random vertical position
                    left="-50px"
                    animation={`${flyAcross} ${6 + r[1] * 7}s linear ${r[2] * 7}s infinite`}
                    transform="rotate(0deg)"
                    fontSize="40px"
                    zIndex="2"
                    opacity="0.8"
                    userSelect="none"
                >
                    💩
                </Box>
            ))}
        </React.Fragment>
    );
}