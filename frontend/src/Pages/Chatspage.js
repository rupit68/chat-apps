import React from "react";
import { Chatstate } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../compo/miscellaneous/SideDrawer";
import ChatBox from "../compo/ChatBox";
import MyChats from "../compo/MyChats";
const Chatspage = () => {
  const { user } = Chatstate();
  return (
    <div style={{ width: "100%" }}>
      {user ? <SideDrawer /> : <h1>No User Found</h1>}

      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatspage;
