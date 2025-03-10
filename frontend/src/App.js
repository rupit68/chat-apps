import "./App.css";
import { Route } from "react-router-dom";
import Chatspage from "./Pages/Chatspage";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Homepages from "./Pages/Homepages";
function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepages} exact />
      <Route path="/chats" component={Chatspage} />
    </div>
  );
}

export default App;
