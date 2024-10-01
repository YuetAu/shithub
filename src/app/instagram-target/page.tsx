"use client"
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Text,
    useColorModeValue
} from '@chakra-ui/react';

const InstagramBrowserDetector = () => {

    const bg = useColorModeValue('rgba(0,0,0,0.8)', 'rgba(255,255,255,0.8)');
    const color = useColorModeValue('white', 'black');

    /* if (!isInstagramBrowser) {
        return null;
    } */

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg={bg}
            zIndex="overlay"
        >
            <Grid
                templateRows="repeat(3, 1fr)"
                height="100vh"
                gap={4}
                px={4}
            >
                <GridItem rowSpan={2}>
                    <Flex h="100%" justifyContent="center" alignItems="center" textAlign="center">
                        <Text color={color} fontSize="50" fontWeight="700" zIndex="99">
                            請使用外置瀏覽器開啟
                        </Text>
                    </Flex>
                </GridItem>
                <GridItem>
                    <Flex h="100%" justifyContent="center" alignItems="center" textAlign="center">
                        <Text color={color} fontSize="100" fontWeight="1000" zIndex="99">
                            💩
                        </Text>
                        <Text color={color} fontSize="50" fontWeight="100" zIndex="99">
                            ShitHub
                        </Text>
                    </Flex>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default InstagramBrowserDetector;
