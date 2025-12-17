import { Route, Routes } from "react-router-dom";
import Signup from "./components/common/Signup";
import Login from "./components/common/Login";
import BoardWrite from "./components/board/BoardWrite";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/boardwrite" element={<BoardWrite />} />
    </Routes>
  );
}

export default App;
