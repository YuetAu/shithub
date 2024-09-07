"use client";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { AuthContext, AuthDispatchContext } from "./context/authContext";
import { ShitCounter } from "./pages/ShitCounter";
import { UserInfoPage } from "./pages/UserInfoPage";
import { UserLoginPage } from "./pages/UserLoginPage";
import { ShitBackground } from "./props/ShitBackground";
import { TabSelector } from "./props/TabSelector";

export default function Home() {
  // [Sys] ContinerHeight Helper Functions and States
  const [containerHeight, setContainerHeight] = useState(0);
  const heightEventListner = useRef(false);

  useEffect(() => {
    if (!heightEventListner.current) {
      const handleResize = () => {
        setContainerHeight(window.innerHeight);
      }
      handleResize();
      window.addEventListener('resize', handleResize);
      heightEventListner.current = true;
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [])

  const [tab, setTab] = useState(0);

  const [auth, dispatch] = useReducer(authReducer, initialAuth);

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        <>
          <Box
            bgColor={"#5C3A00"}
            position="relative"
            overflow="hidden"
          >
            <ShitBackground containerHeight={containerHeight} />

            <Grid
              h={containerHeight}
              w={"sm"}
              m={"auto"}
              templateRows='repeat(6, 1fr)'
              templateColumns='repeat(1, 1fr)'
              overflow={"hidden"}
              zIndex="99"
            >
              {tab === 0 && <ShitCounter />}
              {tab === 1 && (auth.auth ? <UserInfoPage /> : <UserLoginPage />)}
              <GridItem>
                <Flex h={"100%"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                  <TabSelector tab={tab} setTab={setTab} />
                </Flex>
              </GridItem>
            </Grid>
          </Box>
        </>
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return { auth: true, user: action.payload }
    case 'LOGOUT':
      return { auth: false, user: null }
    default:
      return state
  }
}

const initialAuth = {
  auth: false,
  user: null,
}

