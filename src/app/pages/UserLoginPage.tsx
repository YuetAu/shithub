import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Flex, GridItem, Input, Spinner, Text } from '@chakra-ui/react';
import { startAuthentication, platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { IconKeyFilled } from '@tabler/icons-react';
import { debounce } from 'lodash';
import { GetLoginChallenge, UserLogin, UserRegister } from '../helper/User';
import { authFetch } from '../helper/authFetch';
import { AuthDispatchContext, useAuthDispatch } from '../context/authContext';
import { BACKEND_URL } from '../common/const';

export const UserLoginPage: React.FC = () => {
    const [state, setState] = useState({
        username: '',
        isInvalid: false,
        errorText: '',
        allowRegister: true,
        isProcessing: false,
        isLoggingIn: false,
    });

    const userNameInputRef = useRef<HTMLInputElement>(null);
    const checkUsernameIDRef = useRef('');
    const authDispatch = useAuthDispatch();

    const updateState = (newState: Partial<typeof state>) => setState(prev => ({ ...prev, ...newState }));

    const checkUsername = debounce(async (username: string) => {
        if (!username) return;
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
    }, 300);

    const handleAuth = async () => {
        if (state.isProcessing) return;
        updateState({ isProcessing: true, errorText: '' });

        try {
            if (state.allowRegister) {
                const res = await UserRegister(state.username, authDispatch);
                //if (res) alert('Registration success');
                if (!res) throw new Error('Registration failed');
            } else {
                const userID = checkUsernameIDRef.current || localStorage.getItem('userID');
                if (!userID) throw new Error('No userID found');
                const challenge = await GetLoginChallenge(userID);
                const authResp = await startAuthentication(challenge.options);
                await UserLogin(challenge.uuid, authResp, authDispatch);
                const userData = await authFetch(`${BACKEND_URL}/user/me`, 'GET');
                authDispatch({ type: 'LOGIN', payload: userData.user });
            }
        } catch (error) {
            console.error('Auth error:', error);
            updateState({ errorText: 'Authentication failed. Please try again.', isInvalid: true });
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
                updateState({ isProcessing: true });
                try {
                    const res = await authFetch(`${BACKEND_URL}/user/me`, 'GET');
                    authDispatch({ type: 'LOGIN', payload: res.user });
                } catch (error) {
                    console.error('Auth check error:', error);
                } finally {
                    updateState({ isProcessing: false });
                }
            } else if (userID) {
                updateState({ isLoggingIn: true, allowRegister: false });
            }
        };

        checkAuthStatus();
    }, []);

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
            zIndex={99}
            gap="0.5rem"
        >
            <Input
                size="lg"
                autoComplete="username webauthn"
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
                bgColor={state.isProcessing ? "gray.600" : "black"}
                display="flex"
                alignItems="center"
                textColor="white"
                transition="all 0.2s ease"
                onClick={handleAuth}
                disabled={state.isProcessing}
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
                    >
                        <Spinner size="md" ml="0.5rem" />
                        <Text>Signing in...</Text>
                    </Box>
                ) : renderAuthContent()}
            </Flex>
        </GridItem>
    );
};