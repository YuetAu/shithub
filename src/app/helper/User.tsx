import { platformAuthenticatorIsAvailable, startRegistration } from "@simplewebauthn/browser";
import { AuthDispatchContext } from "../context/authContext";
import { authFetch } from "./authFetch";
import { BACKEND_URL } from "../common/const";
import React, { useContext } from "react";

export const UserRegister = async (username: string) => {
    username = username.trim();
    if (!username || username.length === 0) {
        alert("Please enter a username");
        return;
    }
    if (!await platformAuthenticatorIsAvailable()) {
        alert("We are sorry, but your device does not support Passkey registration.");
        return;
    }
    const challengeResponse = await fetch(`${BACKEND_URL}/user/reg-challenge`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
        }),
    });
    if (!challengeResponse.ok) {
        console.log("Failed to get challenge ERR: FETCH-CHALLENGE");
        return false;
    }
    let challengeData;
    try {
        challengeData = await challengeResponse.json();
    } catch (e) {
        console.log("Failed to get challenge ERR: PARSE-CHALLENGE");
        return false;
    }
    if (!challengeData || !challengeData.success) {
        console.log("Failed to get challenge ERR: INVALID-CHALLENGE");
        return false;
    }
    const passkeyRes = await startRegistration(challengeData.options);
    const registerResponse = await fetch(`https://shithub-backend.yuetau.workers.dev/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uuid: challengeData.uuid,
            passkeyResponse: passkeyRes,
        }),
    });
    console.log("Passkey response: ", passkeyRes);
    if (!registerResponse.ok) {
        console.log("Failed to register ERR: FETCH-REGISTER");
        return false;
    }
    let registerData;
    try {
        registerData = await registerResponse.json();
    } catch (e) {
        console.log("Failed to register ERR: PARSE-REGISTER");
        return false;
    }
    if (!registerData || !registerData.success || !registerData.userID) {
        console.log("Failed to register ERR: INVALID-REGISTER");
        return false;
    }
    localStorage.setItem("userID", registerData.userID);
    localStorage.setItem("AToken", registerData.AToken);
    localStorage.setItem("RToken", registerData.RToken);
    return true;
};

export const UserLogin = async (uuid: string, authResp: any) => {
    const authDispatch = useContext(AuthDispatchContext);
    const loginResponse = await fetch(`https://shithub-backend.yuetau.workers.dev/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uuid: uuid,
            response: authResp,
        }),
    });
    if (!loginResponse.ok) {
        console.log("Failed to login ERR: FETCH-LOGIN");
        return false;
    }
    let loginData;
    try {
        loginData = await loginResponse.json();
    } catch (e) {
        console.log("Failed to login ERR: PARSE-LOGIN");
        return false;
    }
    if (!loginData || !loginData.success) {
        console.log("Failed to login ERR: INVALID-LOGIN");
        return false;
    }
    localStorage.setItem("userID", loginData.userID);
    localStorage.setItem("AToken", loginData.AToken);
    localStorage.setItem("RToken", loginData.RToken);
    return true;
};

export const GetUserInfo = async () => {
    const infoResponse = await authFetch(`https://shithub-backend.yuetau.workers.dev/user/me`, "GET");
    if (!infoResponse.ok) {
        console.log("Failed to get user info ERR: FETCH-INFO");
        return false;
    }
    let infoData;
    try {
        infoData = await infoResponse.json();
    } catch (e) {
        console.log("Failed to get user info ERR: PARSE-INFO");
        return false;
    }
    if (!infoData || !infoData.success || !infoData.username) {
        console.log("Failed to get user info ERR: INVALID-INFO");
        return false;
    }
    return infoData;
}


export const GetLoginChallenge = async (userID: string) => {
    const challengeResponse = await fetch(`https://shithub-backend.yuetau.workers.dev/user/login-challenge`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID: userID,
        }),
    });
    if (!challengeResponse.ok) {
        console.log("Failed to get login challenge ERR: FETCH-CHALLENGE");
        return false;
    }
    let challengeData;
    try {
        challengeData = await challengeResponse.json();
    } catch (e) {
        console.log("Failed to get login challenge ERR: PARSE-CHALLENGE");
        return false;
    }
    if (!challengeData || !challengeData.success || !challengeData.options || !challengeData.uuid) {
        console.log("Failed to get login challenge ERR: INVALID-CHALLENGE");
        return false;
    }
    console.log("Challenge data: ", challengeData);
    return challengeData;
};
