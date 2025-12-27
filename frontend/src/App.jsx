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
        // ⭐ localStorage 또는 sessionStorage에서 복원 시도
        const savedUser =
          localStorage.getItem("loginUser") ||
          sessionStorage.getItem("loginUser");

        if (savedUser) {
          // 저장된 정보가 있으면 먼저 복원
          setLoginUser(JSON.parse(savedUser));
        }

        // 서버와 세션 동기화
        const user = await getCurrentUserAPI();
        setLoginUser(user);

        // ⭐ 서버에서 세션 없으면 저장소도 클리어
        if (!user) {
          localStorage.removeItem("loginUser");
          sessionStorage.removeItem("loginUser");
        }
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
