import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSetRecoilState } from "recoil";

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
import MyPage from "./components/member/Mypage";
import Settings from "./components/settings/Settings";

import { loginUserState } from "./components/utils/authState";
import { getCurrentUserAPI } from "./components/utils/authUtils";

import FindPassword from "./components/common/FindPassword";

function App() {
  const setLoginUser = useSetRecoilState(loginUserState);

  // 앱 시작 시: 서버 쿠키 기준으로 로그인 상태 동기화
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUserAPI();
        setLoginUser(user);
          sessionStorage.getItem("loginUser");
      } catch (e) {
        if (e.message !== "Unauthorized") {
          setLoginUser(null);
          localStorage.removeItem("loginUser");
          sessionStorage.removeItem("loginUser");
        }
      }
    })();
  }, [setLoginUser]);

  return (
    <div className="wrap">
      <Header />
      <main className="section">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/boardwrite" element={<BoardWrite />} />
          <Route path="/boardEditePage/:postId" element={<BoardEditPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<MyPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
