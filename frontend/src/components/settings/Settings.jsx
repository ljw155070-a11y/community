import { useState, useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { loginUserState } from "../utils/authState";
import axios from "axios";
import "./settings.css";

// 비밀번호 검증 함수 (회원가입과 동일)
const validatePassword = (pw) => {
  const lengthOk = pw.length >= 8 && pw.length <= 20;
  const hasLetter = /[A-Za-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const types = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
  const typesOk = types >= 2;

  return {
    lengthOk,
    hasLetter,
    hasNumber,
    hasSpecial,
    typesOk,
    ok: lengthOk && typesOk,
  };
};

const Settings = () => {
  const loginUser = useRecoilValue(loginUserState);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordMessage, setCurrentPasswordMessage] = useState("");

  useEffect(() => {
    if (loginUser) {
      setName(loginUser.name || "");
      setEmail(loginUser.email || "");
      loadBio();
    }
  }, [loginUser]);

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

  const checkCurrentPassword = async (password) => {
    if (!password) {
      setCurrentPasswordMessage("");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_SERVER}/settings/check-password/${
          loginUser.memberId
        }`,
        { password: password }
      );

      if (response.data.isValid) {
        setCurrentPasswordMessage("비밀번호가 맞습니다");
      } else {
        setCurrentPasswordMessage("비밀번호가 틀립니다");
      }
    } catch (error) {
      setCurrentPasswordMessage("비밀번호가 틀립니다");
    }
  };

  const pwCheck = useMemo(() => validatePassword(newPassword), [newPassword]);

  const passwordMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  const saveProfile = async () => {
    try {
      if (!name.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }

      let passwordChanged = false;

      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
          alert("현재 비밀번호를 입력해주세요.");
          return;
        }

        if (currentPasswordMessage !== "비밀번호가 맞습니다") {
          alert("현재 비밀번호가 일치하지 않습니다.");
          return;
        }

        if (!newPassword) {
          alert("새 비밀번호를 입력해주세요.");
          return;
        }

        if (!pwCheck.ok) {
          alert("비밀번호 정책을 확인해주세요.");
          return;
        }

        if (!confirmPassword) {
          alert("새 비밀번호 확인을 입력해주세요.");
          return;
        }

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

        passwordChanged = true;
      }

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

      if (passwordChanged) {
        alert("프로필 및 비밀번호가 저장되었습니다.");
      } else {
        alert("프로필이 저장되었습니다.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordMessage("");

      loadBio();
    } catch (error) {
      console.error("저장 실패:", error);

      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("저장에 실패했습니다.");
      }
    }
  };

  const goToAlerts = () => {
    window.location.href = "/app/alert";
  };

  const goToPrivacy = () => {
    window.location.href = "/app/terms/privacy";
  };

  return (
    <div className="settings-page">
      <div className="settings-sidebar">
        <button className="settings-menu-item active">프로필</button>
        <button className="settings-menu-item" onClick={goToAlerts}>
          알림
        </button>
        <button className="settings-menu-item" onClick={goToPrivacy}>
          개인정보
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-header">
          <h2>프로필 설정</h2>
          <p>기본 프로필 정보를 관리하세요</p>
        </div>

        <div className="settings-section">
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="settings-section">
          <label>이메일</label>
          <input type="email" value={email} disabled />
        </div>

        <div className="settings-section">
          <label>자기소개</label>
          <textarea
            placeholder="자신을 소개해주세요"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="settings-section">
          <h3>비밀번호 변경</h3>

          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              checkCurrentPassword(e.target.value);
            }}
          />
          {currentPasswordMessage && (
            <p
              className={`password-message ${
                currentPasswordMessage === "비밀번호가 맞습니다"
                  ? "success"
                  : "error"
              }`}
            >
              {currentPasswordMessage}
            </p>
          )}

          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="pw-rules">
            <div className={pwCheck.lengthOk ? "ok" : "err"}>• 8~20자</div>
            <div className={pwCheck.typesOk ? "ok" : "err"}>
              • 영문/숫자/특수문자 2종 이상
            </div>
          </div>

          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && (
            <p
              className={`password-message ${
                passwordMatch ? "success" : "error"
              }`}
            >
              {passwordMatch
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        <button className="settings-save-btn" onClick={saveProfile}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default Settings;
