import { Box, Flex, GridItem, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuth } from "../context/authContext";

export const UserInfoPage = (props: any) => {

    const auth = useAuth();

    return (
        <>
            <GridItem rowSpan={5}>
                <Box
                    shadow={"lg"} rounded={"lg"} p={"0.5rem"}
                    bgColor={"white"}
                    userSelect={"none"}
                    cursor={"pointer"}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    textColor={"black"}
                    gap={"0.5rem"}
                >
                    <Text>UserID: {auth.user.userID}</Text>
                    <Text>Username: {auth.user.username}</Text>
                </Box>
            </GridItem>
        </>
    )
};