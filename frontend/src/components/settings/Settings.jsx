import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { loginUserState } from "../utils/authState";
import axios from "axios";
import "./settings.css";

const Settings = () => {
  // Recoil에서 로그인한 사용자 정보 가져오기
  const loginUser = useRecoilValue(loginUserState);

  // 입력 필드 상태 (처음엔 빈 값)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 페이지 열릴 때 로그인한 사람 정보를 input에 넣기
  useEffect(() => {
    if (loginUser) {
      setName(loginUser.name || "");
      setEmail(loginUser.email || "");
      loadBio();
    }
  }, [loginUser]);

  // 서버에서 자기소개 불러오기
  const loadBio = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACK_SERVER}/settings/${loginUser.memberId}`
      );
      setBio(response.data.bio || "");
    } catch (error) {
      console.error("자기소개 불러오기 실패:", error);
    }
  };

  // 저장 버튼 클릭
  const saveProfile = async () => {
    try {
      // 프로필 정보 저장
      await axios.put(
        `${import.meta.env.VITE_BACK_SERVER}/settings/profile/${
          loginUser.memberId
        }`,
        {
          name: name,
          email: email,
          bio: bio,
        }
      );

      // 비밀번호 변경 요청 (입력했을 때만)
      if (currentPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          alert("새 비밀번호가 일치하지 않습니다.");
          return;
        }

        await axios.put(
          `${import.meta.env.VITE_BACK_SERVER}/settings/password/${
            loginUser.memberId
          }`,
          {
            currentPassword: currentPassword,
            newPassword: newPassword,
          }
        );
      }

      alert("저장되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="settings-page">
      {/* 왼쪽 사이드바 */}
      <div className="settings-sidebar">
        <button className="settings-menu-item active">프로필</button>
        <button className="settings-menu-item">알림</button>
        <button className="settings-menu-item">개인정보</button>
      </div>

      {/* 오른쪽 내용 */}
      <div className="settings-content">
        <div className="settings-header">
          <h2>프로필 설정</h2>
          <p>기본 프로필 정보를 관리하세요</p>
        </div>

        {/* 이름 입력 */}
        <div className="settings-section">
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 이메일 입력 */}
        <div className="settings-section">
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 자기소개 입력 */}
        <div className="settings-section">
          <label>자기소개</label>
          <textarea
            placeholder="자신을 소개해주세요"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* 비밀번호 변경 */}
        <div className="settings-section">
          <h3>비밀번호 변경</h3>

          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* 저장 버튼 */}
        <button className="settings-save-btn" onClick={saveProfile}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default Settings;
