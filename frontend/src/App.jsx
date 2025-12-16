import { Route, Routes } from "react-router-dom";
import Signup from "./components/member/Signup";
import Login from "./components/common/Login";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
