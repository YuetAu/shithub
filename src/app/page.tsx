"use client";
import { Box, Flex, Grid, GridItem, Tab, Text, keyframes, useToast } from "@chakra-ui/react";
import { IconAwardFilled, IconPooFilled } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShitBackground } from "./props/ShitBackground";
import { TabSelector } from "./props/TabSelector";
import React from "react";
import { ShitCounter } from "./pages/ShitCounter";
import { UserLoginPage } from "./pages/UserLoginPage";
import { useAuth } from "./context/authContext";
import { UserInfoPage } from "./pages/UserInfoPage";

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

  const auth = useAuth();

  return (
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
  );
}

