import React from "react";
import { Chatstate } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchagain, setfetchagain }) => {
  const { SelectedChat } = Chatstate();
  return (
    <Box
      display={{ base: SelectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchagain={fetchagain} setfetchagain={setfetchagain} />
    </Box>
  );
};

export default ChatBox;
