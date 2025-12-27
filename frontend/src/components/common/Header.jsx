import React, { useEffect, useRef, useState } from "react";
import "./header.css";

import { Link, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginUserState } from "../utils/authState";
import { logoutAPI, getCurrentUserAPI } from "../utils/authUtils";
import logoImage from "../../assets/커뮤니티_로고.png";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const loginUser = useRecoilValue(loginUserState);
  const setLoginUser = useSetRecoilState(loginUserState);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = (e) => {
    e.preventDefault();
    logoutAPI(setLoginUser);
  };

  // 페이지 이동할 때마다 로그인 상태 체크
  useEffect(() => {
    // 로그인/회원가입 페이지에서는 체크 안 함
    if (location.pathname === "/login" || location.pathname === "/signup") {
      return;
    }

    (async () => {
      try {
        const me = await getCurrentUserAPI();
        if (me) {
          setLoginUser(me);
        } else {
          setLoginUser(null);
        }
      } catch (e) {
        console.log("인증 체크 에러:", e.message);
      }
    })();
  }, [location.pathname, setLoginUser]);

  // 드롭다운 외부 클릭 시 닫기
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
    <header className="header site-header">
      <div className="header-container">
        <a href="/mainpage" className="logo">
          <img src={logoImage} alt="커뮤니티 로고" className="logo-icon" />
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
          <a href="/minigame/apple" className="nav-link">
            미니게임
          </a>
        </nav>

        <div className="header-right">
          {!loginUser ? (
            <>
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
              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="profile-button" onClick={toggleDropdown}>
                  <span className="profile-name">
                    {loginUser.nickname || loginUser.name}
                  </span>
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

                  <div className="dropdown-divider"></div>

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
