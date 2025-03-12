import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Chatstate } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvtar/UserListIteam";
import UserBadgeItem1 from "../UserAvtar/UserBadgeItem1";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [SelectedUsers, setSelectedUsers] = useState([]);
  const [Search, setSearch] = useState("");
  const [SearchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);

  const toast = useToast();
  const { user, Chats, setChats } = Chatstate();

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
  const handelsubmit = async () => {
    if (!groupChatName || !SelectedUsers) {
      toast({
        title: "please fill all fields ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const confing = {
        headers: {
          Authorization: user.token,
        },
      };
      const { data } = await axios.post(
        "/quickchat/group",
        {
          name: groupChatName,
          users: JSON.stringify(SelectedUsers.map((u) => u._id)),
        },
        confing
      );
      setChats([data, ...Chats]);
      onClose();
      toast({
        title: "New Group Chat created ",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Filed to Create Chat!",
        description: error.message + " failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottomt",
      });
    }
  };
  const handelDelete = (deluser) => {
    setSelectedUsers(SelectedUsers.filter((sel) => sel._id !== deluser._id));
  };
  const handelGroup = (userToAdd) => {
    if (SelectedUsers.includes(userToAdd)) {
      toast({
        title: "user already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...SelectedUsers, userToAdd]);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Enter Members"
                mb={1}
                onChange={(e) => handelsearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" width="100%" flexWrap="wrap">
              {SelectedUsers.map((u) => (
                <UserBadgeItem1
                  key={user._id}
                  user={u}
                  handleFunction={() => handelDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading...</div>
            ) : (
              SearchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handelGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={handelsubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
