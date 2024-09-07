import { Box, Flex, GridItem, Input, Spinner, Text } from "@chakra-ui/react";
import { browserSupportsWebAuthnAutofill, startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { IconKeyFilled } from "@tabler/icons-react";
import { debounce } from "lodash";
import { use, useEffect, useRef, useState } from "react";
import { GetLoginChallenge, UserLogin, UserRegister } from "../helper/User";
import { authFetch } from "../helper/authFetch";

export const User = (props: any) => {

    const userNameInput = useRef<HTMLInputElement>(null);
    const [isInvalid, setIsInvalid] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [allowRegister, setAllowRegister] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const checkUsernameID = useRef("");

    const checkUsername = debounce(async (username: string) => {
        if (username) {
            console.log("Checking username: " + username);
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
                checkUsernameID.current = "";
            } else {
                setIsInvalid(true);
                setErrorText(`Username ${username} is already taken`);
                setAllowRegister(false);
                checkUsernameID.current = data.userID;
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
            const AToken = localStorage.getItem("AToken");
            if (AToken) {
                console.log("Already logged in");
                console.log("Test fetch");
                authFetch("https://shithub-backend.yuetau.workers.dev/user/me", "GET").then(res => {
                    console.log(res);
                    alert("Already logged in");
                    // Need to supply userDetail Context Provider
                });
            } else {
                console.log("Try to login with userID: " + userID);
                setIsLoggingIn(true);
                return;
            }
        }
    }, []);

    const login = async (userID: string) => {
        console.log("Start login with userID: " + userID);
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

    useEffect(() => {
        if (isLoggingIn) {
            const userIDLS = localStorage.getItem("userID");
            const userIDRef = checkUsernameID.current;
            const userID = userIDRef || userIDLS;
            if (!userID) {
                console.log("No userID found");
                setIsLoggingIn(false);
                return;
            }
            login(userID);
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
                            gap={"0.5rem"}
                        >
                            <Spinner size='md' ml={"0.5rem"} /><Text>Signing in...</Text>
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
                            onClick={(e) => { allowRegister ? register(userNameInput.current?.value || "") : setIsLoggingIn(true) }}
                        >
                            {isRegistering ? (<Spinner size='md' />) : (<><IconKeyFilled size={"20"} /><Text fontSize={"20"} fontWeight={"500"} ml={"1"}>{allowRegister ? "Register" : "Sign In"} with Passkey</Text></>)}
                        </Box>
                    </Box>)}
                </Flex>
            </GridItem >
        </>
    )
};