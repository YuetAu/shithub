import { Box, Flex, GridItem, Input, Spinner, Text } from "@chakra-ui/react";
import { browserSupportsWebAuthnAutofill, startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { IconKeyFilled } from "@tabler/icons-react";
import { debounce } from "lodash";
import { use, useEffect, useRef, useState } from "react";
import { GetLoginChallenge, UserLogin, UserRegister } from "../helper/User";

export const User = (props: any) => {

    const userNameInput = useRef<HTMLInputElement>(null);
    const [isInvalid, setIsInvalid] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [allowRegister, setAllowRegister] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const checkUsername = debounce(async (username: string) => {
        if (username) {
            const response = await fetch(`https://shithub-backend.yuetau.workers.dev/user/check-username/${username}`);
            if (!response.ok) {
                console.log("Failed to check username");
                return;
            }
            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.log("Failed to parse check username response");
                return;
            }
            if (data && data.available) {
                setIsInvalid(false);
                setErrorText("");
                setAllowRegister(true);
            } else {
                setIsInvalid(true);
                setErrorText(`Username ${username} is already taken`);
                setAllowRegister(false);
            }
        }
    }, 300);

    const register = async (username: string) => {
        if (!allowRegister) {
            return;
        }
        if (isRegistering) {
            return;
        }
        if (isLoggingIn) {
            return;
        }
        setIsRegistering(true);
        const res = await UserRegister(username);
        if (res) {
            alert("Registration success");
        } else {
            setErrorText("Hmm... Something went wrong. Please try again later.");
        }
        setIsRegistering(false);
    }

    useEffect(() => {
        if (!platformAuthenticatorIsAvailable()) {
            console.log("Platform Authenticator is not available");
            return;
        }
        const userID = localStorage.getItem("userID");
        if (userID) {
            console.log("User already registered");
            console.log("Try to login with userID: " + userID);
            setIsLoggingIn(true);
        }
    }, []);

    useEffect(() => {
        if (isLoggingIn) {
            const userID = localStorage.getItem("userID");
            if (!userID) {
                console.log("No userID found");
                setIsLoggingIn(false);
                return;
            }
            GetLoginChallenge(userID)
                .then((res: any) => {
                    console.log("Start authentication");
                    startAuthentication(res.options)
                        .then(async authResp => {
                            console.log("Authentication success");
                            console.log(authResp);
                            await UserLogin(res.uuid, authResp);
                            setIsLoggingIn(false);
                        })
                })
                .catch(err => {
                    console.log("Failed to start authentication");
                    console.log(err);
                    setErrorText("Failed to start authentication");
                    setIsLoggingIn(false);
                });
        }
    }, [isLoggingIn]);

    return (
        <>
            <GridItem rowSpan={5}>
                <Flex h={"100%"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} >
                    {isLoggingIn ? (
                        <Box
                            shadow={"lg"} rounded={"lg"} p={"0.5rem"}
                            bgColor={"white"}
                            userSelect={"none"}
                            cursor={"pointer"}
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            textColor={"black"}
                            transition={"all 0.2s ease"}
                            flex={"1"}
                            flexDir={"row"}
                            gap={"0.5rem"}
                        >
                            <Spinner size='md' /> <Text>Signing in...</Text>
                        </Box>
                    ) : (<Box
                        shadow={"lg"} rounded={"lg"} p={"0.5rem"}
                        w={"20rem"}
                        bgColor={"white"}
                        userSelect={"none"}
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        textColor={"black"}
                        zIndex="99"
                        gap={"0.5rem"}
                    >
                        <Input
                            size='lg'
                            autoComplete={"username webauthn"}
                            placeholder={"Pick a username"}
                            onChange={(e) => { checkUsername(e.target.value) }}
                            disabled={isRegistering}
                            ref={userNameInput}
                            isInvalid={false}
                        />
                        {errorText && <Text textColor={"red"} fontSize={"12"}>{errorText}</Text>}
                        <Box
                            shadow={"lg"} rounded={"lg"} p={"0.5rem"}
                            bgColor={isRegistering ? "gray.600" : "black"}
                            userSelect={"none"}
                            cursor={"pointer"}
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            textColor={"white"}
                            transition={"all 0.2s ease"}
                            onClick={(e) => { isRegistering ? e.preventDefault() : e.preventDefault(); register(userNameInput.current?.value || ""); }}
                        >
                            {isRegistering ? (<Spinner size='md' />) : (<><IconKeyFilled size={"20"} /><Text fontSize={"20"} fontWeight={"500"} ml={"1"}>{allowRegister ? "Register" : "Sign In"} with Passkey</Text></>)}
                        </Box>
                    </Box>)}
                </Flex>
            </GridItem>
        </>
    )
};