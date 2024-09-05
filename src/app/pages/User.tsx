import { Box, Flex, GridItem, Input, Text } from "@chakra-ui/react";
import { startRegistration } from "@simplewebauthn/browser";
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { IconKeyFilled } from "@tabler/icons-react";
import { debounce } from "lodash";
import { useRef } from "react";

export const User = (props: any) => {

    const userNameInput = useRef<HTMLInputElement>(null);

    const checkUsername = debounce(async (username: string) => {
        if (username) {
            const response = await fetch(`https://shithub-backend.yuetau.workers.dev/user/check-username/${username}`);
            const data = await response.json();
            return data.available;
        }
    }, 300);

    const register = async () => {
        if (!userNameInput.current?.value) {
            alert("Please enter a username");
            return;
        }
        if (!await platformAuthenticatorIsAvailable()) {
            alert("Platform Authenticator is not available");
            return;
        }
        const challengeResponse = await fetch(`https://shithub-backend.yuetau.workers.dev/user/challenge`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userNameInput.current?.value!,
            }),
        });
        const data = await challengeResponse.json();
        if (!data.success) {
            alert("Failed to get challenge");
            return;
        }
        const passkeyres = await startRegistration(data.options);
        const registerResponse = await fetch(`https://shithub-backend.yuetau.workers.dev/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uuid: data.uuid,
                passkeyResponse: passkeyres,
            }),
        });
        const registerData = await registerResponse.json();
        if (registerData.success) {
            alert("Registered Successfully");
        } else {
            alert("Failed to register");
        }
    };

    return (
        <>
            <GridItem rowSpan={5}>
                <Flex h={"100%"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} >
                    <Box
                        shadow={"lg"} rounded={"lg"} p={"0.5rem"}
                        w={"sm"}
                        bgColor={"white"}
                        userSelect={"none"}
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        textColor={"black"}
                        zIndex="99"
                        gap={"0.5rem"}
                    >
                        <Input size='lg' autoComplete={"username webauthn"} placeholder={"Pick a username"} onChange={(e) => { checkUsername(e.target.value) }} ref={userNameInput} />
                        <Box
                            shadow={"lg"} rounded={"lg"} p={"0.5rem"}
                            bgColor={"black"}
                            userSelect={"none"}
                            cursor={"pointer"}
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            textColor={"white"}
                            onClick={register}
                        >
                            <IconKeyFilled size={"20"} /><Text fontSize={"20"} fontWeight={"500"} ml={"1"}>Register with Passkey</Text>
                        </Box>
                    </Box>
                </Flex>
            </GridItem>
        </>
    )
};