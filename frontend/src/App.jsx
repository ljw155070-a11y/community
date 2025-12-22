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
import Alert from "./components/alert/Alert";
import MyPage from "./components/member/Mypage";
import Settings from "./components/settings/Settings";

import { loginUserState } from "./components/utils/authState";
import { getCurrentUserAPI } from "./components/utils/authUtils";

function App() {
  const setLoginUser = useSetRecoilState(loginUserState);

  // ✅ 앱 시작 시: 서버 쿠키 기준으로 로그인 상태 동기화
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUserAPI(); // success면 user, 아니면 null
        setLoginUser(user); // null이면 자동 로그아웃 상태로 맞춰짐
      } catch (e) {
        // 서버 죽었거나 CORS/쿠키 문제여도 앱이 죽지 않게 무시
        setLoginUser(null);
      }
    })();
  }, [setLoginUser]);

  return (
    <div className="wrap">
      <Header />
      <main className="section">
        <Routes>
          {/* 너 라우팅 기준 (Header에서 /app/login 쓰고 싶으면 여기도 맞춰야 함) */}
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
      <Footer />
    </div>
  );
}

export default App;
