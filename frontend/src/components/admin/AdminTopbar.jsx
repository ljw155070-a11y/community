import React from "react";
import { NavLink } from "react-router-dom";
import "./admin.css";

export default function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <nav className="admin-nav">
          <NavLink
            to="/app/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            대시보드
          </NavLink>
          <NavLink
            to="/app/admin/members"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            회원 관리
          </NavLink>
          <NavLink
            to="/app/admin/posts"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            게시글 관리
          </NavLink>
          <NavLink
            to="/app/admin/reports"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            신고 관리
          </NavLink>
          <NavLink
            to="/app/admin/settings"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            운영 설정
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
