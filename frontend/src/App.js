import "./App.css";
import { Route } from "react-router-dom";
import Hoempage from "./Pages/Hoempage";
import Chatspage from "./Pages/Chatspage";
function App() {
  return (
    <div className="App">
      <Route path="/" component={Hoempage} exact />
      <Route path="/chats" component={Chatspage} />
    </div>
  );
}

export default App;
