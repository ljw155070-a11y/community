// Alert.jsx
import React, { useState, useEffect } from "react";
import "./alert.css";
import axios from "axios";

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    loadAlerts();
  }, []); // 빈 배열 - 한번만 실행

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const memberId = 1;
      const response = await axios.get(
        `${import.meta.env.VITE_BACK_SERVER}/app/alert/list/${memberId}`
      );
      setAlerts(response.data);
      setUnreadCount(response.data.filter((a) => a.isRead === "N").length);
    } catch (error) {
      console.error("알림 불러오기 실패:", error);
      setAlerts([]); // 에러시 빈 배열
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACK_SERVER}/app/alert/read/${alertId}`
      );
      setAlerts(
        alerts.map((alert) =>
          alert.alertId === alertId ? { ...alert, isRead: "Y" } : alert
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACK_SERVER}/app/alert/delete/${alertId}`
      );
      setAlerts(alerts.filter((alert) => alert.alertId !== alertId));
    } catch (error) {
      console.error("알림 삭제 실패:", error);
    }
  };

  // 화면에 보여줄 알림 목록 필터링
  // activeTab이 "all"이면 전체 알림, "unread"면 안읽은 알림만
  const displayAlerts =
    activeTab === "all"
      ? alerts
      : alerts.filter((alert) => alert.isRead === "N");

  // 게시글 상세페이지로 이동하는 함수
  // postId를 받아서 해당 게시글 페이지로 이동
  // 게시글 상세페이지로 이동하는 함수
  const goToPost = (postId) => {
    window.location.href = `${
      import.meta.env.VITE_BACK_SERVER
    }/board/postDetail/${postId}`;
  };

  if (loading) {
    return <div className="alert-page">로딩 중...</div>;
  }

  return (
    <div className="alert-page">
      <div className="alert-container">
        <div className="alert-header">
          <h2>알림</h2>
          <div className="alert-tabs">
            <button
              className={`alert-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              전체 ({alerts.length})
            </button>
            <button
              className={`alert-tab ${activeTab === "unread" ? "active" : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              읽지 않음 ({unreadCount})
            </button>
          </div>
        </div>
        <div className="alert-list">
          {/* 알림이 없으면 "알림이 없습니다" 표시 */}
          {displayAlerts.length === 0 ? (
            <p className="alert-empty">알림이 없습니다</p>
          ) : (
            // 알림이 있으면 각 알림을 화면에 표시
            displayAlerts.map((alert) => (
              <div
                key={alert.alertId}
                // 안읽은 알림이면 "unread" 클래스 추가
                className={`alert-item ${alert.isRead === "N" ? "unread" : ""}`}
              >
                {/* 알림 아이콘 (타입별로 다른 이모지) */}
                <div className="alert-icon">
                  {alert.alertType === "COMMENT" && "💬"}
                  {alert.alertType === "LIKE" && "❤️"}
                  {alert.alertType === "REPLY" && "⚠️"}
                </div>

                {/* 알림 내용 */}
                <div className="alert-content">
                  <p>{alert.content}</p>
                  <span className="alert-time">{alert.createdAt}</span>

                  {/* 자세히 보기 링크 */}
                  <a
                    href="#"
                    className="alert-link"
                    onClick={(e) => {
                      e.preventDefault(); // 링크 기본 동작 막기
                      markAsRead(alert.alertId); // 읽음 처리
                      goToPost(alert.relatedPostId); // 게시글로 이동
                    }}
                  >
                    자세히 보기 →
                  </a>
                </div>

                {/* 읽은 알림이면 체크 표시 */}
                {alert.isRead === "Y" && <span className="alert-check">✓</span>}

                {/* 삭제 버튼 */}
                <button
                  className="alert-delete"
                  onClick={() => deleteAlert(alert.alertId)}
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
        <div className="alert-footer">
          <p>알림 설정을 변경하고 싶으신가요?</p>
          <button className="alert-settings-btn">설정 페이지로 이동</button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
