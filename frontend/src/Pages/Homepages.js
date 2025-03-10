import {
  Box,
  Container,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../compo/Authentication/Login";
import Signup from "../compo/Authentication/Signup";
import { useHistory } from "react-router-dom"; // Keep this for React Router v5

const Homepages = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center" // Centers horizontally
        p={3}
        bg={"white"} // Use a valid Chakra color
        w="100%"
        m="40px 0px 15px 0px"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"Work Sans, sans-serif"}
          textAlign={"center"}
        >
          <p>
            Quick<span style={{ color: "red" }}>C</span>hat
          </p>
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius="lg"
        color={"black"}
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="red">
          <TabList mb="1em">
            <Tab width={"50%"} color={"black"}>
              Login
            </Tab>
            <Tab width={"50%"} color={"black"}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepages;
