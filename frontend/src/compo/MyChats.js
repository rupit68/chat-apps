import React, { useEffect, useState } from "react";
import { Chatstate } from "../Context/ChatProvider";
import {
  Box,
  Button,
  Stack,
  Text,
  useToast,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getsender } from "../config/ChatLogics";

const MyChats = () => {
  const [loguser, setloguser] = useState();
  console.log("loguser :>> ", loguser);
  const { user, setSelectedChat, SelectedChat, Chats, setChats } = Chatstate();
  console.log("Chats sAAs:>> ", Chats);

  const toast = useToast();

  const fetchChat = async () => {
    try {
      const confing = {
        headers: {
          Authorization: user.token,
        },
      };
      console.log("tok", user.token);

      const { data } = await axios.get("/quickchat/fetchchat", confing);
      setChats(data);
      console.log("data->", data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message + " failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userinfo");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // console.log("parsedUser.data._id :>> ", parsedUser.data._id);
        if (parsedUser.data._id) {
          setloguser(parsedUser.data._id);
        } else {
          console.error("Error: loguser is missing _id", parsedUser);
          setloguser(null);
        }
      } catch (error) {
        console.error("Error parsing userinfo from localStorage", error);
        setloguser(null);
      }
    }
  }, []);

  return (
    <Box
      display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={"white"}
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <p>
          My <span style={{ color: "red" }}>C</span>hats
        </p>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group<span style={{ color: "red" }}>C</span>hats
        </Button>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {Chats ? (
          <Stack overflowY="scroll">
            {Chats.map((chat) => (
              <Box
                onClick={() => {
                  console.log("Previous SelectedChat:", SelectedChat);
                  console.log("New SelectedChat:", chat);
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                bg={SelectedChat?._id === chat._id ? "#B62625" : "#E8E8E8"}
                color={SelectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getsender(loguser, chat.users)
                    : chat.chatName}
                </Text>

                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}

        {/* Display the second chat's users inside a table */}
      </Box>
    </Box>
  );
};

export default MyChats;
