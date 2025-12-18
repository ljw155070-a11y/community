import { Route, Routes } from "react-router-dom";
import Signup from "./components/common/Signup";
import Login from "./components/common/Login";
import BoardWrite from "./components/board/BoardWrite";
import BoardEditPage from "./components/board/BoardEditPage";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import About from "./components/about/About";
import Alert from "./components/alert/Alert";

function App() {
  return (
    <div className="wrap">
      <Header></Header>
      <main className="section">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/boardwrite" element={<BoardWrite />} />
          <Route path="/boardEditePage/:postId" element={<BoardEditPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/alert" element={<Alert />} />
        </Routes>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
