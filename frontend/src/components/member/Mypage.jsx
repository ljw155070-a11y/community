import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { loginUserState } from "../utils/authState"; // 실제 경로에 맞게 수정하세요
import "./mypage.css";

const MyPage = () => {
  // Recoil에서 로그인 사용자 정보 가져오기
  const loginUser = useRecoilValue(loginUserState);
  const memberId = loginUser?.memberId;

  // 디버깅: 로그인 정보 확인
  console.log("로그인 사용자:", loginUser);
  console.log("memberId:", memberId);

  // 회원 정보 및 통계 데이터
  const [userData, setUserData] = useState({
    name: loginUser?.name || "",
    email: loginUser?.email || "",
    nickname: loginUser?.nickname || "",
    joinDate: "",
    profileImage: null,
    stats: {
      postsWritten: 0,
      commentsWritten: 0,
      receivedLikes: 0,
    },
  });

  // 활동 내역 데이터
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [activeTab, setActiveTab] = useState("작성한 글");
  const [loading, setLoading] = useState(true);

  // 회원 정보 및 통계 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACK_SERVER
          }/member/mypage/profile/${memberId}`
        );

        // 응답 상태 확인
        console.log("응답 상태:", response.status);
        console.log("응답 헤더:", response.headers.get("content-type"));

        // 응답 텍스트 먼저 확인
        const text = await response.text();
        console.log("응답 내용 (처음 500자):", text.substring(0, 500));

        // JSON 파싱 시도
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("JSON 파싱 실패:", parseError);
          console.error(
            "받은 내용이 HTML입니다. 백엔드 API가 404 또는 에러를 반환했습니다."
          );
          setLoading(false);
          return;
        }

        console.log("API 응답 데이터:", data);

        if (response.ok && data.member) {
          const { member, stats } = data;

          console.log("회원 정보:", member);
          console.log("통계 정보:", stats);

          setUserData({
            name: member.name || "이름 없음",
            email: member.email || "",
            nickname: member.nickname || "",
            joinDate: member.createdAt || "",
            profileImage: null,
            stats: {
              postsWritten: stats?.postsWritten || 0,
              commentsWritten: stats?.commentsWritten || 0,
              receivedLikes: stats?.receivedLikes || 0,
            },
          });
        }
      } catch (error) {
        console.error("프로필 조회 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchUserProfile();
    }
  }, [memberId]);

  // 작성한 글 목록 조회
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_SERVER}/member/mypage/posts/${memberId}`
        );
        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("작성한 글 조회 실패:", error);
      }
    };

    if (memberId) {
      fetchPosts();
    }
  }, [memberId]);

  // 작성한 댓글 목록 조회
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACK_SERVER
          }/member/mypage/comments/${memberId}`
        );
        const data = await response.json();

        if (response.ok) {
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error("작성한 댓글 조회 실패:", error);
      }
    };

    if (memberId) {
      fetchComments();
    }
  }, [memberId]);

  // 좋아요한 글 목록 조회
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACK_SERVER
          }/member/mypage/liked-posts/${memberId}`
        );
        const data = await response.json();

        if (response.ok) {
          setLikedPosts(data.likedPosts || []);
        }
      } catch (error) {
        console.error("좋아요한 글 조회 실패:", error);
      }
    };

    if (memberId) {
      fetchLikedPosts();
    }
  }, [memberId]);

  // 현재 탭에 따른 데이터 가져오기
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

  // 프로필 이미지 업로드 핸들러
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="mypage-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  // 로그인하지 않은 경우
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
                프로필 수정
              </label>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
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
            {activeTab === "작성한 글" &&
              posts.length > 0 &&
              posts.map((post) => (
                <div key={post.postId} className="post-item">
                  <div className="post-header">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.createdAt}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <div className="post-stats">
                    <span className="post-stat">조회 {post.viewCount}</span>
                    <span className="post-stat">
                      💬 댓글 {post.commentCount}
                    </span>
                    <span className="post-stat">
                      ❤️ 좋아요 {post.likeCount}
                    </span>
                  </div>
                </div>
              ))}

            {activeTab === "작성한 댓글" &&
              comments.length > 0 &&
              comments.map((comment) => (
                <div key={comment.commentId} className="post-item">
                  <div className="post-header">
                    <span className="post-category">{comment.category}</span>
                    <span className="post-date">{comment.createdAt}</span>
                  </div>
                  <h3 className="post-title">
                    <span className="comment-label">[댓글]</span>{" "}
                    {comment.postTitle}
                  </h3>
                  <p className="post-content">{comment.content}</p>
                </div>
              ))}

            {activeTab === "좋아요한 글" &&
              likedPosts.length > 0 &&
              likedPosts.map((post) => (
                <div key={post.postId} className="post-item">
                  <div className="post-header">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.createdAt}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <div className="post-stats">
                    <span className="post-stat">
                      작성자: {post.authorNickname}
                    </span>
                    <span className="post-stat">조회 {post.viewCount}</span>
                    <span className="post-stat">
                      💬 댓글 {post.commentCount}
                    </span>
                    <span className="post-stat">
                      ❤️ 좋아요 {post.likeCount}
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
