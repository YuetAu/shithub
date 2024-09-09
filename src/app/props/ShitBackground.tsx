import React, { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { holdFloat, flyAcross } from "../styles/keyframes";

interface ShitBackgroundProps {
    containerHeight: number;
}

const POOP_COUNT = 10;

const generateRandomArray = (length: number) =>
    Array.from({ length }, () => [Math.random(), Math.random(), Math.random()]);

/* const FloatingPoop: React.FC<{ r: number[] }> = ({ r }) => (
    <Box
        position="absolute"
        top={`${r[0] * 100}%`}
        left={`${r[1] * 100}%`}
        fontSize={`${r[2] * 30 + 20}px`}
        opacity="0.3"
        animation={`${holdFloat} ${r[1] * r[2] / r[0] * 3 + 2}s ease-in-out infinite`}
        zIndex={2}
        userSelect="none"
    >
        💩
    </Box>
);

const FlyingPoop: React.FC<{ r: number[], containerHeight: number }> = ({ r, containerHeight }) => (
    <Box
        position="absolute"
        bottom={`${r[0] * containerHeight}px`}
        left="-50px"
        animation={`${flyAcross} ${6 + r[1] * 7}s linear ${r[2] * 7}s infinite`}
        transform="rotate(0deg)"
        fontSize="40px"
        zIndex={2}
        opacity="0.8"
        userSelect="none"
    >
        💩
    </Box>
); */

export const ShitBackground: React.FC<ShitBackgroundProps> = ({ containerHeight }) => {
    const randomArray = useMemo(() => generateRandomArray(POOP_COUNT), []);

    return (
        <>
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                opacity="0.1"
                backgroundImage="url('/poop.svg')"
                backgroundRepeat="repeat"
                zIndex={1}
            />

            {/*  {randomArray.map((r, i) => (
                <FloatingPoop key={`floating-${i}`} r={r} />
            ))}

            {randomArray.map((r, i) => (
                <FlyingPoop key={`flying-${i}`} r={r} containerHeight={containerHeight} />
            ))} */}
        </>
    );
};
