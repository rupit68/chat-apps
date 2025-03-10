import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useState } from "react";
import { Chatstate } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListIteam from "../UserAvtar/UserListIteam";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, Chats, setChats } = Chatstate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log("user->", user.data.name); // ✅ Debugging step: Check if user is properly initialized
  const history = useHistory();
  const logouthandler = () => {
    localStorage.removeItem("userinfo");
    history.push("/");
  };
  const Toast = useToast();
  const searchhandler = async () => {
    if (!search) {
      Toast({
        title: "Please Enter Something In Search.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const confing = {
        headers: {
          Authorization: user.token,
        },
      };

      const { data } = await axios.get(
        `/quickchat/alluser?search=${search}`,
        confing
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      Toast({
        title: "error ocurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const confing = {
        headers: {
          "Content-type": "application/json",
          Authorization: user.token,
        },
      };
      console.log("User Token2:", user.token);
      console.log("UserId being sent:", userId);

      const { data } = await axios.post("/quickchat/chat", { userId }, confing);
      console.log("chat->", data);

      if (!Chats.find((c) => c._id === data._id)) setChats([data, ...Chats]);
      console.log("c._id->", data._id);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.error(
        "Chat fetch error:",
        error.response ? error.response.data : error.message
      );

      Toast({
        title: "Error Fetching The Chat.",
        description: error.response ? error.response.data.error : error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User To Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          <p>
            Quick<span style={{ color: "red" }}>C</span>hat
          </p>
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<i className="fa-solid fa-chevron-down"></i>} // ✅ Fixed `class` to `className`
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.data.name}
                src={user.data.pic}
              />{" "}
              {/* ✅ Fixed optional chaining */}
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem> {/* ✅ Fixed: Added MenuItem */}
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logouthandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <p>
              Search<span style={{ color: "red" }}>U</span>ser
            </p>
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search By Name Or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchhandler} bg="#D2042D" color={"white"}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListIteam
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner ml="auto" display="flex" colorScheme="red" />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
