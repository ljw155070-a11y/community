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

  // ✅ (추가) recoil이 비어있으면 /me로 1회 동기화
  useEffect(() => {
    if (!loginUser) {
      (async () => {
        const me = await getCurrentUserAPI();
        if (me) setLoginUser(me);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          <Link to="/about" className="nav-link">
            사이트 소개 (임시)
          </Link>
          <Link to="/admin" className="nav-link">
            관리자 (임시)
          </Link>
        </nav>

        <div className="header-right">
          {!loginUser ? (
            <>
              <Link className="btn-login" to="/login">
                로그인
              </Link>
              <Link className="btn-signup" to="/signup">
                회원가입
              </Link>
            </>
          ) : (
            <>
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
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </Link>

              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="profile-button" onClick={toggleDropdown}>
                  <span className="profile-name">
                    {loginUser.nickname || loginUser.name}
                  </span>
                </button>

                <div
                  className={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}
                >
                  <Link to="/profile" className="dropdown-item">
                    <span>내 프로필</span>
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <span>설정</span>
                  </Link>

                  <div className="dropdown-divider"></div>

                  <a
                    href="#"
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
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
