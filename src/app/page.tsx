"use client";

import React, { useEffect, useReducer, useState } from "react";
import { Box } from "@chakra-ui/react";
import { AuthContext, AuthDispatchContext } from "./context/authContext";
import { ShitBackground } from "./props/ShitBackground";
import { TabSelector } from "./props/TabSelector";
import { authFetch } from "./helper/authFetch";
import { BACKEND_URL } from "./common/const";

const initialAuth = {
  auth: false,
  user: null,
};

const authReducer = (state: any, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'LOGIN':
      return { auth: true, user: action.payload };
    case 'LOGOUT':
      return { auth: false, user: null };
    case 'SHIT':
      return { ...state, user: { ...state.user, shitCount: action.payload } }
    default:
      return state;
  }
};

const useContainerHeight = () => {
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => setContainerHeight(window.innerHeight);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return containerHeight;
};

const Home: React.FC = () => {
  const containerHeight = useContainerHeight();
  const [tab, setTab] = useState(0);
  const [auth, dispatch] = useReducer(authReducer, initialAuth);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      dispatch({ type: 'LOGIN', payload: parsedAuth.user });

      // Validate the token
      authFetch(`${BACKEND_URL}/user/me`, 'GET')
        .then(response => {
          if (response) {
            dispatch({ type: 'LOGIN', payload: response.user });
          } else {
            throw new Error('Invalid token');
          }
        })
        .catch(() => {
          // Error occurred, log out the user
          dispatch({ type: 'LOGOUT' });
          localStorage.removeItem('AToken');
          localStorage.removeItem('RToken');
        });
    }
  }, []);

  useEffect(() => {
    if (auth.auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        <Box
          bgColor="#5C3A00"
          position="relative"
          overflow="hidden"
          height={`${containerHeight}px`}
        >
          <ShitBackground containerHeight={containerHeight} />


          <TabSelector tab={tab} setTab={setTab} />
        </Box>
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export default Home;
