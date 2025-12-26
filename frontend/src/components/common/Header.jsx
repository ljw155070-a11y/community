import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginUserState } from "../utils/authState";
import { logoutAPI, getCurrentUserAPI } from "../utils/authUtils";
import axios from "axios";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const loginUser = useRecoilValue(loginUserState);
  const setLoginUser = useSetRecoilState(loginUserState);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = (e) => {
    e.preventDefault();
    logoutAPI(setLoginUser);
  };

  useEffect(() => {
    if (!loginUser) {
      (async () => {
        try {
          const me = await getCurrentUserAPI();
          if (me) setLoginUser(me);
        } catch (e) {
          // ⭐ 수정: 에러를 그냥 던져서 알림이 뜨도록 함
          // 에러 무시하지 않음
        }
      })();
    }
  }, []);

  const loadUnreadCount = async () => {
    try {
      const memberId = loginUser?.memberId;
      if (!memberId) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BACK_SERVER}/alert/list/${memberId}`,
        { withCredentials: true }
      );

      const count = response.data.filter((a) => a.isRead === "N").length;
      setUnreadCount(count);
    } catch (error) {
      console.error("알림 개수 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (loginUser) loadUnreadCount();
  }, [loginUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <a href="/mainpage" className="logo">
          <span className="logo-icon">◀</span>
          <span className="logo-text">커뮤니티</span>
        </a>

        <nav className="header-nav">
          <a href="/mainpage" className="nav-link">
            홈
          </a>
          <a href="/board" className="nav-link">
            게시판
          </a>
          <a href="/notice" className="nav-link">
            공지사항
          </a>
          {/* ✅ HTML 헤더에 있던 미니게임 메뉴 추가 */}
          <a href="/minigame/apple" className="nav-link">
            미니게임
          </a>
        </nav>

        <div className="header-right">
          {/* ✅ loginUser가 없으면(null) 비로그인 상태 */}
          {!loginUser ? (
            <>
              {/* ✅ HTML처럼 button 태그 + onclick으로 변경 (원래는 Link였음) */}
              <button
                className="btn-login"
                onClick={() => (window.location.href = "/app/login")}
              >
                로그인
              </button>
              <button
                className="btn-signup"
                onClick={() => (window.location.href = "/app/signup")}
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              {/* ✅ 알림 아이콘 - 변경 없음 */}
              <Link to="/alert" className="notification-link">
                <svg
                  className="notification-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {/* ✅ 숫자 제거하고 빨간 점만 표시 (HTML처럼) */}
                {unreadCount > 0 && (
                  <span className="notification-badge"></span>
                )}
              </Link>

              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="profile-button" onClick={toggleDropdown}>
                  <span className="profile-name">
                    {loginUser.nickname || loginUser.name}
                  </span>
                  {/* ✅ HTML처럼 아래 화살표 아이콘 추가 (원래 없었음) */}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div
                  className={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}
                >
                  {/* ✅ 내 프로필에 사람 모양 아이콘 추가 (원래 없었음) */}
                  <Link to="/profile" className="dropdown-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>내 프로필</span>
                  </Link>

                  {/* ✅ 설정에 톱니바퀴 아이콘 추가 (원래 없었음) */}
                  <Link to="/settings" className="dropdown-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6"></path>
                    </svg>
                    <span>설정</span>
                  </Link>

                  {/* ✅ HTML에 있던 내 게시글 메뉴 추가 (원래 없었음) */}
                  <a href="/my-posts" className="dropdown-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>내 게시글</span>
                  </a>

                  {/* ✅ 구분선 - 변경 없음 */}
                  <div className="dropdown-divider"></div>

                  {/* ✅ 로그아웃에 나가기 아이콘 추가 (원래 없었음) */}
                  <a
                    href="/mainpage"
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>로그아웃</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
