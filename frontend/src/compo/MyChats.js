import React, { useEffect, useState } from "react";
import { Chatstate } from "../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getsender } from "../config/ChatLogics";
import GroupChatModel from "./miscellaneous/GroupChatModel";

const MyChats = ({ fetchagain }) => {
  const [loguser, setloguser] = useState();
  console.log("loguser :>> ", loguser);
  const { user, setSelectedChat, SelectedChat, Chats, setChats } = Chatstate();
  const toast = useToast();

  // ✅ Load Chats from localStorage First
  useEffect(() => {
    const storedChats = localStorage.getItem("chats");
    if (storedChats) {
      setChats(JSON.parse(storedChats)); // Load cached chats
    }
    fetchChat(); // Always fetch latest chats
  }, [fetchagain]); // Re-fetch when `fetchagain` changes

  // ✅ Fetch Chats and Store in LocalStorage
  const fetchChat = async () => {
    try {
      const config = {
        headers: { Authorization: user.token },
      };
      console.log("Fetching chats with token:", user.token);

      const { data } = await axios.get("/quickchat/fetchchat", config);
      setChats(data); // Update state
      localStorage.setItem("chats", JSON.stringify(data)); // ✅ Save to localStorage
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load chats: " + error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // ✅ Load user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userinfo");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
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
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group<span style={{ color: "red" }}>C</span>hats
          </Button>
        </GroupChatModel>
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
      </Box>
    </Box>
  );
};

export default MyChats;
