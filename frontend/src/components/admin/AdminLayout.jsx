import React from "react";
import { Outlet } from "react-router-dom";
import AdminTopbar from "./AdminTopbar";
import "./admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-wrap">
      <AdminTopbar />
      <div className="admin-page">
        <Outlet />
      </div>
    </div>
  );
}
