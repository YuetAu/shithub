import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, GridItem, Input, Spinner, Text } from '@chakra-ui/react';
import { startAuthentication, platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { IconKeyFilled } from '@tabler/icons-react';
import { debounce } from 'lodash';
import { GetLoginChallenge, GetUserInfo, UserLogin, UserRegister } from '../helper/User';
import { authFetch } from '../helper/authFetch';
import { AuthDispatchContext, useAuthDispatch } from '../context/authContext';
import { BACKEND_URL } from '../common/const';
import { useTabSet } from '../context/tabContext';

const ENGLISH = /^[A-Za-z0-9]*$/;

export const UserLoginPage: React.FC = () => {
    const [state, setState] = useState({
        username: '',
        isInvalid: false,
        errorText: '',
        allowRegister: false,
        isProcessing: false,
        isLoggingIn: false,
        isLocked: false
    });

    const userNameInputRef = useRef<HTMLInputElement>(null);
    const checkUsernameIDRef = useRef('');
    const authDispatch = useAuthDispatch();
    const tabSet = useTabSet();

    const updateState = (newState: Partial<typeof state>) => setState(prev => ({ ...prev, ...newState }));

    const checkUsername = debounce(async (username: string) => {
        if (!username) {
            updateState({
                allowRegister: false,
            });
        }
        updateState({ isLocked: true })
        if (!ENGLISH.test(username)) {
            updateState({
                isInvalid: true,
                errorText: "Only english character accepted",
                allowRegister: false,
            });
            return;
        }
        if (username.length > 10) {
            updateState({
                isInvalid: true,
                errorText: "Username too long",
                allowRegister: false,
            });
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/user/check-username/${username}`);
            if (!response.ok) throw new Error('Failed to check username');
            const { available, userID } = await response.json();
            updateState({
                isInvalid: !available,
                errorText: available ? '' : `Username ${username} is already taken`,
                allowRegister: available,
            });
            checkUsernameIDRef.current = available ? '' : userID;
        } catch (error) {
            console.error('Error checking username:', error);
        }
        updateState({ isLocked: false })
    }, 300);

    const handleAuth = async () => {
        if (state.isProcessing) return;
        updateState({ isProcessing: true, errorText: '' });

        try {
            if (state.allowRegister) {
                const res = await UserRegister(state.username);
                if (!res) throw new Error('SFRG');
            } else {
                const challenge = await GetLoginChallenge();
                if (!challenge) throw new Error('SFLC');
                const authResp = await startAuthentication(challenge.options);
                if (!authResp) throw new Error('CFSA');
                const res = await UserLogin(challenge.token, authResp);
                if (!res) throw new Error('SFLG');
            }
            const userData = await GetUserInfo();
            if (!userData) throw new Error('SFGU');
            authDispatch({ type: 'LOGIN', payload: userData.user });
            tabSet(2);
        } catch (error) {
            console.error('Auth error:', error);
            updateState({
                errorText: `Authentication failed. Please try again. ${error}`, isInvalid: true, isLoggingIn: false
            });
        } finally {
            updateState({ isProcessing: false });
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (!platformAuthenticatorIsAvailable()) {
                console.warn('Platform Authenticator is not available');
                return;
            }

            const userID = localStorage.getItem('userID');
            const AToken = localStorage.getItem('AToken');

            if (userID && AToken) {
                console.log("Procressing")
                updateState({ isProcessing: true });
            } else if (userID) {
                console.log("UserID")
                updateState({ isLoggingIn: true, allowRegister: false });
            }
        };

        checkAuthStatus();
    }, []);

    useEffect(() => {
        const stateChangeTrigger = async () => {
            if (state.isLoggingIn) {
                console.log("Logging in")
                await handleAuth();
            } else if (state.isProcessing) {
                try {
                    const res = await authFetch(`${BACKEND_URL}/user/me`, 'GET');
                    if (!res) throw new Error('Invalid token');
                    authDispatch({ type: 'LOGIN', payload: res.user });
                    tabSet(2);
                } catch (error) {
                    authDispatch({ type: 'LOGOUT' });
                    console.error('Auth check error:', error);
                } finally {
                    updateState({ isProcessing: false });
                }
            }
        }

        stateChangeTrigger()
    }, [state])

    const renderAuthContent = () => (
        <Box
            shadow="lg"
            rounded="lg"
            p="0.5rem"
            w="20rem"
            bgColor="white"
            userSelect="none"
            display="flex"
            flexDirection="column"
            alignItems="center"
            textColor="black"
            zIndex={50}
            gap="0.5rem"
        >
            <Input
                size="lg"
                autoComplete="webauthn"
                placeholder="Pick a username"
                onChange={(e) => {
                    updateState({ username: e.target.value });
                    checkUsername(e.target.value);
                }}
                disabled={state.isProcessing}
                ref={userNameInputRef}
                isInvalid={state.isInvalid}
            />
            {state.errorText && <Text textColor="red" fontSize={12}>{state.errorText}</Text>}
            <Box
                as="button"
                shadow="lg"
                rounded="lg"
                p="0.5rem"
                bgColor={state.isProcessing || state.isLocked ? "gray.600" : "black"}
                display="flex"
                alignItems="center"
                textColor="white"
                transition="all 0.1s ease"
                onClick={handleAuth}
                disabled={state.isProcessing || state.isLocked}
            >
                {state.isProcessing ? (
                    <Spinner size="md" />
                ) : (
                    <>
                        <IconKeyFilled size={20} />
                        <Text fontSize={20} fontWeight={500} ml={1}>
                            {state.allowRegister ? 'Register' : 'Sign In'} with Passkey
                        </Text>
                    </>
                )}
            </Box>

            {state.errorText && <Button
                as="a"
                href="https://forms.office.com/r/dc9hhvSYdH"
                target="_blank"
                colorScheme="red"
            >
                Report Error
            </Button>}
        </Box>
    );

    return (
        <GridItem rowSpan={5}>
            <Flex h="100%" justifyContent="center" alignItems="center" textAlign="center">
                {state.isLoggingIn || state.isProcessing ? (
                    <Box
                        shadow="lg"
                        rounded="lg"
                        p="0.5rem"
                        bgColor="white"
                        display="flex"
                        alignItems="center"
                        textColor="black"
                        gap="0.5rem"
                        zIndex={50}
                    >
                        <Spinner size="md" ml="0.5rem" />
                        <Text>Signing in...</Text>
                    </Box>
                ) : renderAuthContent()}
            </Flex>
        </GridItem>
    );
};