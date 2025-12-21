import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./components/common/Signup";
import Login from "./components/common/Login";
import BoardWrite from "./components/board/BoardWrite";
import BoardEditPage from "./components/board/BoardEditPage";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import About from "./components/about/About";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminMembers from "./components/admin/AdminMembers";
import AdminPosts from "./components/admin/AdminPosts";
import AdminReports from "./components/admin/AdminReports";
import AdminSettings from "./components/admin/AdminSettings";
import Alert from "./components/alert/Alert";
import MyPage from "./components/member/Mypage";
import Settings from "./components/settings/Settings";

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
          <Route path="/profile" element={<MyPage />} />

          {/* ✅ Admin (CSR) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/alert" element={<Alert />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
