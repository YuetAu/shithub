import React, { useState } from "react";
import {
    Box,
    GridItem,
    Text,
    VStack,
    Heading,
    Input,
    Button,
    useToast,
    Avatar,
    Flex,
    IconButton,
} from "@chakra-ui/react";
import { useAuth, useAuthDispatch } from "../context/authContext";
import { IconEdit, IconCancel, IconCheck } from "@tabler/icons-react";
import { authFetch } from "../helper/authFetch";
import { BACKEND_URL } from "../common/const";

export const UserInfoPage = () => {
    const auth = useAuth();
    const authDispatch = useAuthDispatch();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [newDisplayname, setNewDisplayname] = useState(auth.user.displayName);

    const handleSave = () => {
        authFetch(`${BACKEND_URL}/user/displayname`, "PATCH", { displayName: newDisplayname }).then((response) => {
            if (response.success) {
                authDispatch({ type: "LOGIN", payload: { ...auth.user, displayName: newDisplayname } });
                toast({
                    title: "成功",
                    description: "已更新名稱",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "唔好意思",
                    description: "更新名稱失敗",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            }
        });


        setIsEditing(false);
    };

    const userIDToIDNo = (userID: string) => {
        const split = userID.split("-");
        const timestamp = parseInt(split[split.length - 1]);
        return split[0] + "-" + timestamp.toString(16);
    }

    return (
        <GridItem rowSpan={5} display="flex" justifyContent="center" alignItems="center">
            <Box
                width="350px"
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(10px)"
                borderRadius="lg"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
                overflow="hidden"
                position="relative"
                zIndex={10}
            >
                <Box bg="brown.500" py={4} textAlign="center">
                    <Heading as="h1" size="lg" color="black">
                        💩 屎民身分證 💩
                    </Heading>
                </Box>

                <VStack spacing={4} p={6} pb={0}>
                    <Avatar
                        size="xl"
                        name={auth.user.userName}
                        src="/poop.svg"
                        border="4px solid"
                        borderColor="brown.500"
                    />

                    <Box textAlign="center" width="100%">
                        <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                            身分證編號
                        </Text>
                        <Text fontSize="md" color="brown.800" fontFamily="monospace">
                            {userIDToIDNo(auth.user.userID)}
                        </Text>
                    </Box>

                    <Box textAlign="center" width="100%">
                        <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                            法定姓名
                        </Text>
                        <Text fontSize="xl" color="brown.800" fontWeight="bold" noOfLines={1}>
                            {auth.user.userName}
                        </Text>
                    </Box>

                    <Box textAlign="center" width="100%">
                        <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                            姓名
                        </Text>
                        {isEditing ? (
                            <Flex>
                                <Input
                                    value={newDisplayname}
                                    onChange={(e) => setNewDisplayname(e.target.value)}
                                    placeholder="Enter new username"
                                    size="sm"
                                    borderColor="brown.300"
                                />
                                <IconButton
                                    aria-label="Save username"
                                    icon={<IconCheck />}
                                    onClick={handleSave}
                                    ml={2}
                                    size="sm"
                                    colorScheme="green"
                                />
                                <IconButton
                                    aria-label="Cancel editing"
                                    icon={<IconCancel />}
                                    onClick={() => setIsEditing(false)}
                                    ml={2}
                                    size="sm"
                                    colorScheme="red"
                                />
                            </Flex>
                        ) : (
                            <Flex alignItems="center" justifyContent="center">
                                {auth.user.displayName && <Text fontSize="xl" color="brown.800" fontWeight="bold" mr={2}>
                                    {auth.user.displayName}
                                </Text>}
                                <IconButton
                                    aria-label="Edit username"
                                    icon={<IconEdit />}
                                    onClick={() => setIsEditing(true)}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="brown"
                                />
                            </Flex>
                        )}
                    </Box>

                    <Box textAlign="center" width="100%">
                        <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                            屙咗嘅屎屎
                        </Text>
                        <Text fontSize="3xl" color="brown.800" fontWeight="bold">
                            {auth.user.shitCount} 💩
                        </Text>
                    </Box>
                </VStack>
                <Box
                    fontSize="sm"
                    color="gray.500"
                    fontStyle="italic"
                    textAlign="right"
                    p={2}
                >
                    Member since {new Date(auth.user.createdAt).getFullYear()}  {new Date(auth.user.createdAt).toLocaleString('en-US', { month: 'long' })}
                    <br />
                    The holder of this ID has the right to poop
                </Box>
            </Box>
        </GridItem>
    );
};