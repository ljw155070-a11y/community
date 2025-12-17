import React from "react";
import "./header.css";

const Header = () => {
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
        </div>
      </div>
    </header>
  );
};

export default Header;
