import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { loginUserState } from "../utils/authState";
import "./mypage.css";

const MyPage = () => {
  const loginUser = useRecoilValue(loginUserState);
  const memberId = loginUser?.memberId;

  const BACK = (import.meta.env.VITE_BACK_SERVER || "").replace(/\/$/, "");

  const [userData, setUserData] = useState({
    name: loginUser?.name || "",
    email: loginUser?.email || "",
    nickname: loginUser?.nickname || "",
    joinDate: "",
    profileImage: "",
    stats: {
      postsWritten: 0,
      commentsWritten: 0,
      receivedLikes: 0,
    },
  });

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [activeTab, setActiveTab] = useState("작성한 글");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✅ 업로드 파일 URL 만들기
  const fileUrl = (saveName) => (saveName ? `/uploads/${saveName}` : "");

  // ✅ SSR 상세 페이지로 이동
  const goSsrPostDetail = (postId) => {
    if (!postId) return;
    window.location.href = `/board/postDetail/${postId}`;
  };

  // ✅ 회원 정보 + 통계
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${BACK}/member/mypage/profile/${memberId}`
        );
        const data = await response.json();

        if (response.ok && data.member) {
          const { member, stats } = data;

          setUserData({
            name: member.name || "이름 없음",
            email: member.email || "",
            nickname: member.nickname || "",
            joinDate: member.createdAt || "",
            profileImage: fileUrl(member.profileImage),
            stats: {
              postsWritten: stats?.postsWritten || 0,
              commentsWritten: stats?.commentsWritten || 0,
              receivedLikes: stats?.receivedLikes || 0,
            },
          });
        } else {
          console.error("프로필 조회 실패:", data);
        }
      } catch (error) {
        console.error("프로필 조회 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) fetchUserProfile();
  }, [memberId]);

  // ✅ 작성글
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BACK}/member/mypage/posts/${memberId}`);
        const data = await response.json();

        if (response.ok) setPosts(data.posts || []);
        else console.error("작성글 조회 실패:", data);
      } catch (error) {
        console.error("작성글 조회 실패:", error);
      }
    };
    if (memberId) fetchPosts();
  }, [memberId]);

  // ✅ 작성댓글
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${BACK}/member/mypage/comments/${memberId}`
        );
        const data = await response.json();

        if (response.ok) setComments(data.comments || []);
        else console.error("작성댓글 조회 실패:", data);
      } catch (error) {
        console.error("작성댓글 조회 실패:", error);
      }
    };
    if (memberId) fetchComments();
  }, [memberId]);

  // ✅ 좋아요 글
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(
          `${BACK}/member/mypage/liked-posts/${memberId}`
        );
        const data = await response.json();

        if (response.ok) setLikedPosts(data.likedPosts || []);
        else console.error("좋아요글 조회 실패:", data);
      } catch (error) {
        console.error("좋아요글 조회 실패:", error);
      }
    };
    if (memberId) fetchLikedPosts();
  }, [memberId]);

  const getCurrentTabData = () => {
    switch (activeTab) {
      case "작성한 글":
        return posts;
      case "작성한 댓글":
        return comments;
      case "좋아요한 글":
        return likedPosts;
      default:
        return [];
    }
  };

  // ✅ 프로필 이미지 업로드
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${BACK}/member/mypage/profile-image/${memberId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("프로필 이미지 업로드 실패:", data);
        alert(data.error || "프로필 이미지 업로드 실패");
        return;
      }

      setUserData((prev) => ({
        ...prev,
        profileImage: fileUrl(data.saveName),
      }));
    } catch (err) {
      console.error("프로필 이미지 업로드 오류:", err);
      alert("프로필 이미지 업로드 중 오류 발생");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="mypage-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!loginUser || !memberId) {
    return (
      <div className="mypage-container">
        <div className="loading">로그인이 필요한 서비스입니다.</div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <main className="mypage-content">
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-image-wrapper">
              <img
                src={userData.profileImage || "/api/placeholder/80/80"}
                alt="프로필"
                className="profile-image"
              />
              <div className="verified-badge">✓</div>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">{userData.name}</h2>
              {userData.nickname && (
                <p className="profile-nickname">@{userData.nickname}</p>
              )}
              <p className="profile-email">✉ {userData.email}</p>
              <p className="profile-join-date">
                📅 가입일: {userData.joinDate}
              </p>

              <label htmlFor="profile-upload" className="profile-edit-btn">
                {uploading ? "업로드 중..." : "이미지 변경"}
              </label>

              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
                disabled={uploading}
              />
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card stat-posts">
              <div className="stat-icon">📄</div>
              <div className="stat-info">
                <p className="stat-label">작성한 글</p>
                <p className="stat-value">{userData.stats.postsWritten}</p>
              </div>
            </div>
            <div className="stat-card stat-comments">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <p className="stat-label">작성한 댓글</p>
                <p className="stat-value">{userData.stats.commentsWritten}</p>
              </div>
            </div>
            <div className="stat-card stat-likes">
              <div className="stat-icon">❤️</div>
              <div className="stat-info">
                <p className="stat-label">받은 좋아요</p>
                <p className="stat-value">{userData.stats.receivedLikes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="activity-section">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "작성한 글" ? "active" : ""}`}
              onClick={() => setActiveTab("작성한 글")}
            >
              작성한 글
            </button>
            <button
              className={`tab-btn ${
                activeTab === "작성한 댓글" ? "active" : ""
              }`}
              onClick={() => setActiveTab("작성한 댓글")}
            >
              작성한 댓글
            </button>
            <button
              className={`tab-btn ${
                activeTab === "좋아요한 글" ? "active" : ""
              }`}
              onClick={() => setActiveTab("좋아요한 글")}
            >
              좋아요한 글
            </button>
          </div>

          <div className="posts-list">
            {/* ✅ 작성한 글 (클릭 → SSR 상세) */}
            {activeTab === "작성한 글" &&
              posts.length > 0 &&
              posts.map((post) => (
                <div
                  key={post.POSTID}
                  className="post-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => goSsrPostDetail(post.POSTID)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && goSsrPostDetail(post.POSTID)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="post-header">
                    <span className="post-category">{post.CATEGORY}</span>
                    <span className="post-date">{post.CREATEDAT}</span>
                  </div>
                  <h3 className="post-title">{post.TITLE}</h3>
                  <p className="post-content">{post.CONTENT}</p>
                  <div className="post-stats">
                    <span className="post-stat">조회 {post.VIEWCOUNT}</span>
                    <span className="post-stat">
                      💬 댓글 {post.COMMENTCOUNT}
                    </span>
                    <span className="post-stat">
                      ❤️ 좋아요 {post.LIKECOUNT}
                    </span>
                  </div>
                </div>
              ))}

            {/* ✅ 작성한 댓글 (클릭 → 해당 게시글 SSR 상세) */}
            {activeTab === "작성한 댓글" &&
              comments.length > 0 &&
              comments.map((c) => (
                <div
                  key={c.COMMENTID}
                  className="post-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => goSsrPostDetail(c.POSTID)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && goSsrPostDetail(c.POSTID)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="post-header">
                    <span className="post-category">{c.CATEGORY}</span>
                    <span className="post-date">{c.CREATEDAT}</span>
                  </div>
                  <h3 className="post-title">
                    <span className="comment-label">[댓글]</span> {c.POSTTITLE}
                  </h3>
                  <p className="post-content">{c.CONTENT}</p>
                </div>
              ))}

            {/* ✅ 좋아요한 글 (클릭 → SSR 상세) */}
            {activeTab === "좋아요한 글" &&
              likedPosts.length > 0 &&
              likedPosts.map((post) => (
                <div
                  key={post.POSTID}
                  className="post-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => goSsrPostDetail(post.POSTID)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && goSsrPostDetail(post.POSTID)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="post-header">
                    <span className="post-category">{post.CATEGORY}</span>
                    <span className="post-date">{post.CREATEDAT}</span>
                  </div>
                  <h3 className="post-title">{post.TITLE}</h3>
                  <p className="post-content">{post.CONTENT}</p>
                  <div className="post-stats">
                    <span className="post-stat">
                      작성자: {post.AUTHORNICKNAME}
                    </span>
                    <span className="post-stat">조회 {post.VIEWCOUNT}</span>
                    <span className="post-stat">
                      💬 댓글 {post.COMMENTCOUNT}
                    </span>
                    <span className="post-stat">
                      ❤️ 좋아요 {post.LIKECOUNT}
                    </span>
                  </div>
                </div>
              ))}

            {getCurrentTabData().length === 0 && (
              <div className="empty-message">
                {activeTab === "작성한 글" && "작성한 글이 없습니다."}
                {activeTab === "작성한 댓글" && "작성한 댓글이 없습니다."}
                {activeTab === "좋아요한 글" && "좋아요한 글이 없습니다."}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
