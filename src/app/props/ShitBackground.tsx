import { Box } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { float, flyAcross } from "../styles/keyframes";


export const ShitBackground = (props: any) => {

    // State for flying poops
    const [flyingPoops, setFlyingPoops] = useState<{ id: number, delay: number, bottom: number, random: number }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (flyingPoops.length < 20) {
                setFlyingPoops(prev => [...prev, {
                    id: Date.now(),
                    bottom: Math.random() * props.containerHeight,
                    delay: Math.random() * 7,
                    random: 6 + Math.random() * 7
                }]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [flyingPoops]);

    const randomArray = useMemo(() => {
        // Create an array of 20 random numbers
        return Array.from({ length: 20 }, () => [Math.random(), Math.random(), Math.random()]);
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
                    key={i}
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
            {flyingPoops.map((poop, i) => (
                <Box
                    key={i}
                    position="absolute"
                    bottom={`${poop.bottom}px`} // Random vertical position
                    left="-50px"
                    animation={`${flyAcross} ${poop.random}s linear ${poop.delay}s infinite`}
                    transform="rotate(0deg)"
                    fontSize="40px"
                    zIndex="2"
                    opacity="0.8"
                >
                    💩
                </Box>
            ))}
        </React.Fragment>
    );
}