import { useHistory } from "react-router-dom"; // Keep this for React Router v5

const { createContext, useContext, useState, useEffect } = require("react");

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [Chats, setChats] = useState([]);
  const [SelectedChat, setSelectedChat] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));

    setuser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{ user, setSelectedChat, SelectedChat, Chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const Chatstate = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
