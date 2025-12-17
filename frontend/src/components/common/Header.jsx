import React, { useEffect, useState } from "react";
import "./header.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);
    // 클린업 함수
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
        </nav>

        <div className="header-right">
          <button className="btn-login">로그인</button>
          <button className="btn-signup">회원가입</button>

          <a href="/notifications" className="notification-link">
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
            <span className="notification-badge"></span>
          </a>

          <div className="profile-dropdown" ref={dropdownRef}>
            <button className="profile-button" onClick={toggleDropdown}>
              <img
                src="/images/profile.jpg"
                alt="프로필"
                className="profile-image"
                onError={(e) => (e.target.src = "/images/default-profile.png")}
              />
              <span className="profile-name">홍길동</span>
            </button>

            <div className={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}>
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
              <a href="/logout" className="dropdown-item logout">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
