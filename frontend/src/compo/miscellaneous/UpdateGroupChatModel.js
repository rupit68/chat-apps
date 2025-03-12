import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Chatstate } from "../../Context/ChatProvider";
import UserBadgeItem1 from "../UserAvtar/UserBadgeItem1";
import axios from "axios";
import UserListItem from "../UserAvtar/UserListIteam";

const UpdateGroupChatModel = ({ fetchagain, setfetchagain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser, setSelectedChat, SelectedChat } = Chatstate();
  const [groupChatName, setgroupChatName] = useState();
  const [Search, setSearch] = useState("");
  const [SearchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameloading, setrenameloading] = useState(false);
  const handleAddUser = async (user1) => {
    console.log("🔍 Debugging Admin Check:");
    console.log("Chatstate User:", user);
    console.log("SelectedChat:", SelectedChat);

    // ✅ Ensure user is fetched from localStorage if missing
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem("userinfo"));
      if (storedUser) {
        setUser(storedUser);
      }
    }

    // ✅ Ensure user is defined
    if (!user || !user._id) {
      toast({
        title: "User not found! Please log in again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!SelectedChat || !SelectedChat.users) {
      toast({
        title: "Chat data is not loaded yet!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (SelectedChat?.groupAdmin?._id?.toString() !== user?._id?.toString()) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: user.token,
        },
      };

      const { data } = await axios.put(
        "/quickchat/addgroup",
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      console.log("API Response:", data);

      setSelectedChat(data);
      setfetchagain(!fetchagain);
      setloading(false);
    } catch (error) {
      console.error("Error Response:", error.response);

      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Failed to add user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };
  const handleRemove = async (user1) => {
    console.log("🚀 Checking user before removing...");
    console.log("User:", user);
    console.log("SelectedChat:", SelectedChat);

    if (!user || !user._id) {
      console.error("❌ User not found! Please log in again.");
      toast({
        title: "User not found!",
        description: "Please log in again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!SelectedChat || !SelectedChat.groupAdmin) {
      console.error("❌ Chat or group admin info missing!");
      toast({
        title: "Error!",
        description: "Chat or group admin data is missing.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (SelectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // ✅ Fix token usage
        },
      };

      const { data } = await axios.put(
        "/quickchat/removegroup",
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      console.log("✅ API Response:", data);

      if (user1._id === user._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(data);
      }

      setfetchagain((prev) => !prev);
    } catch (error) {
      console.error(
        "❌ Error removing user:",
        error.response?.data?.message || error.message
      );

      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Failed to remove user.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setloading(false);
      setgroupChatName("");
    }
  };

  const handleRename = async () => {
    if (!groupChatName.trim()) return;

    try {
      setrenameloading(true);

      const config = {
        headers: {
          Authorization: user.token,
        },
        validateStatus: () => true, // ✅ Allow all status codes to be treated as successful
      };

      const response = await axios.put(
        "/quickchat/rename",
        { chatId: SelectedChat._id, chatName: groupChatName },
        config
      );

      console.log("Full API Response:", response);

      if (response.status >= 200 && response.status < 300) {
        setSelectedChat(response.data);
        setfetchagain(!fetchagain);
        setgroupChatName("");

        toast({
          title: "Group name updated successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        console.error("Unexpected response status:", response.status);
        toast({
          title: "Unexpected response from server",
          description: `Received status ${response.status}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      console.error("Error Occurred:", error);

      // toast({
      //   title: "Error Occurred!",
      //   description: error.response?.data?.message || "Failed to rename group",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    } finally {
      setrenameloading(false);
    }
  };

  const handelsearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setloading(true);
      const confing = {
        headers: {
          Authorization: user.token,
        },
      };
      const { data } = await axios.get(
        `/quickchat/alluser?search=${Search}`,
        confing
      );
      console.log("data search->", data);
      setloading(false);
      setSearchResult(data);
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
  const toast = useToast();
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      >
        Open Modal
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {SelectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
              {SelectedChat && Array.isArray(SelectedChat.users) ? (
                SelectedChat.users.length > 0 ? (
                  SelectedChat.users.map((u) => (
                    <UserBadgeItem1
                      key={u._id}
                      user={u}
                      admin={SelectedChat?.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))
                ) : (
                  <Text>No users in this chat</Text>
                )
              ) : (
                <Text>Loading chat data...</Text>
              )}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="red"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handelsearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              SearchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
