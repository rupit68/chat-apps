import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";
const Hoempage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"gray"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" textAlign="center">
          QuickChat
        </Text>
      </Box>
      <Box></Box>
    </Container>
  );
};

export default Hoempage;
