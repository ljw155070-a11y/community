// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginUserState } from "../utils/authState";
import { logout } from "../utils/authUtils";
import axios from "axios";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const loginUser = useRecoilValue(loginUserState);
  const setLoginUser = useSetRecoilState(loginUserState);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout(setLoginUser);
  };

  const loadUnreadCount = async () => {
    try {
      const memberId = loginUser.memberId;
      const response = await axios.get(
        `http://localhost:9999/alert/list/${memberId}`
      );
      const count = response.data.filter((a) => a.isRead === "N").length;
      setUnreadCount(count);
    } catch (error) {
      console.error("알림 개수 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (loginUser) {
      loadUnreadCount();
    }
  }, [loginUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">◀</span>
          <span className="logo-text">커뮤니티</span>
        </div>

        <nav className="header-nav">
          <a href="/" className="nav-link">
            홈
          </a>
          <a href="/게시판" className="nav-link">
            게시판
          </a>
          <a href="/공지" className="nav-link">
            공지
          </a>
          <a href="/about" className="nav-link">
            사이트 소개 (임시)
          </a>
          <a href="/admin" className="nav-link">
            관리자 (임시)
          </a>
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
                  <span className="profile-name">{loginUser.name}</span>
                </button>

                <div
                  className={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}
                >
                  <a href="/profile" className="dropdown-item">
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
                  </a>
                  <a href="/settings" className="dropdown-item">
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
                  </a>
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
                  <div className="dropdown-divider"></div>
                  <a
                    href="#"
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
