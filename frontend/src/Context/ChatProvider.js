import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [Chats, setChats] = useState([]);
  const [SelectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userinfo");

    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser); // ✅ Ensure user data is set
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
        localStorage.removeItem("userinfo");
      }
    } else {
      console.log("🔴 No user found, redirecting to login...");
      history.replace("/"); // ✅ Redirect only if no user
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{ user, setUser, Chats, setChats, SelectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Ensure Chatstate() always returns a valid context
export const Chatstate = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("Chatstate must be used within a ChatProvider");
  }

  return context;
};

export default ChatProvider;
