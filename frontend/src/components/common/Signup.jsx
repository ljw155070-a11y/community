// react-router-dom에서 Link 컴포넌트 import
// Link는 <a>처럼 보이지만 페이지 새로고침 없이 SPA 이동을 담당
import { Link, useNavigate } from "react-router-dom";

// React에서 상태와 메모이제이션 훅 import
// useState: 상태 저장
// useMemo: 계산 결과를 기억해 불필요한 재계산 방지
import { useState, useMemo } from "react";

// HTTP 통신을 위한 axios 라이브러리
import axios from "axios";

// 회원가입 페이지 전용 CSS
import "./signup.css";

// 이메일 형식을 검사하기 위한 정규식
// 예: test@test.com 형태인지 확인
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 비밀번호 정책 검증 함수
// pw(비밀번호 문자열)를 받아 조건 충족 여부를 반환
const validatePassword = (pw) => {
  // 길이가 8~20자인지 확인
  const lengthOk = pw.length >= 8 && pw.length <= 20;

  // 영문 포함 여부 (boolean 형태로 값 저장함)
  const hasLetter = /[A-Za-z]/.test(pw);

  // 숫자 포함 여부 (boolean 형태로 값 저장함)
  const hasNumber = /[0-9]/.test(pw);

  // 특수문자 포함 여부 (boolean 형태로 값 저장함)
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);

  // 포함된 문자 종류 개수 계산
  // true인 값만 걸러서 length로 개수 확인
  const types = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  // 최소 2종 이상 포함 여부
  const typesOk = types >= 2;

  // 각 검사 결과와 최종 통과 여부를 객체로 반환
  return {
    lengthOk,
    hasLetter,
    hasNumber,
    hasSpecial,
    typesOk,
    ok: lengthOk && typesOk,
  };
};

// Signup 컴포넌트 정의
export default function Signup() {
  const navigate = useNavigate();
  // 회원가입 폼 전체 값을 하나의 state 객체로 관리
  const [form, setForm] = useState({
    name: "", // 이름
    email: "", // 이메일
    password: "", // 비밀번호
    password2: "", // 비밀번호 확인
    agreeTerms: false, // 이용약관 동의
    agreePrivacy: false, // 개인정보처리방침 동의
  });

  // 이메일 중복 체크 상태
  // idle: 초기
  // checking: 서버 요청 중
  // available: 사용 가능
  // duplicated: 중복
  // invalid: 형식 오류
  const [emailStatus, setEmailStatus] = useState("idle");

  // 이메일 중복 체크 메시지
  const [emailMsg, setEmailMsg] = useState("");

  // 비밀번호 검증 결과를 메모이제이션
  // password가 바뀔 때만 validatePassword 실행
  const pwCheck = useMemo(
    () => validatePassword(form.password),
    [form.password]
  );

  // 비밀번호와 비밀번호 확인이 같은지 검사
  const passwordMatch =
    form.password.length > 0 && form.password === form.password2;

  // 이메일 형식 검사
  const emailValid = EMAIL_REGEX.test(form.email);

  // 회원가입 버튼 활성화 조건
  const canSubmit =
    form.name.trim().length >= 2 && // 이름 2자 이상
    emailStatus === "available" && // 이메일 사용 가능
    pwCheck.ok && // 비밀번호 정책 통과
    passwordMatch && // 비밀번호 일치
    form.agreeTerms && // 약관 동의
    form.agreePrivacy; // 개인정보 동의

  // ✅ 커링 없는 입력 변경 핸들러
  // 모든 input/checkbox가 이 함수 하나를 사용
  const handleInputChange = (e) => {
    // 이벤트 대상에서 필요한 값 추출
    const { name, type, value, checked } = e.target;

    // checkbox면 checked, 아니면 value 사용
    const nextValue = type === "checkbox" ? checked : value;

    // 기존 form 상태를 복사한 뒤
    // name에 해당하는 값만 변경
    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    // 이메일이 변경되면 중복 체크 결과 초기화
    if (name === "email") {
      setEmailStatus("idle");
      setEmailMsg("");
    }
  };

  // 이메일 중복 체크 함수
  const checkEmailDup = async () => {
    // 이메일 형식이 틀리면 서버 요청 안 함
    if (!emailValid) {
      setEmailStatus("invalid");
      setEmailMsg("이메일 형식이 올바르지 않습니다.");
      return;
    }

    try {
      // 중복 확인 중 상태
      setEmailStatus("checking");
      setEmailMsg("중복 확인 중...");

      // 서버로 GET 요청
      const res = await axios.get(
        `${import.meta.env.VITE_BACK_SERVER}/member/email-exists`,
        {
          params: { email: form.email },
        }
      );

      // 서버 응답이 exists=true면 중복
      if (res.data?.exists) {
        setEmailStatus("duplicated");
        setEmailMsg("이미 사용 중인 이메일입니다.");
      } else {
        setEmailStatus("available");
        setEmailMsg("사용 가능한 이메일입니다.");
      }
    } catch (error) {
      // 서버 오류 처리
      setEmailStatus("idle");
      setEmailMsg("중복 확인에 실패했습니다.");
    }
  };

  // 회원가입 버튼 클릭 시 실행
  const onSubmit = async () => {
    // 조건 미충족이면 중단
    if (!canSubmit) return;

    try {
      // (선택) 요청 시작 표시
      // setLoading(true);

      // ✅ 백엔드로 보낼 데이터 (DTO에 맞춰 이름 맞추기)
      const payload = {
        name: form.name, // DTO에 memberName 있음
        email: form.email, // DTO에 추가했다면 같이
        password: form.password, // 보통은 password(원문) 보내고 백엔드에서 해시
      };

      // ✅ 회원가입 호출
      const res = await axios.post(
        `${import.meta.env.VITE_BACK_SERVER}/member/signup`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // 백엔드 응답 예: { success: true }
      if (res.data?.success) {
        alert("회원가입 성공!");
        // TODO: 가입 후 로그인 페이지로 이동
        navigate("/app/login");
      } else {
        alert("회원가입 실패(서버 응답)");
      }
    } catch (error) {
      console.log("SIGNUP ERROR", error);
      console.log("response", error?.response);
      alert("회원가입 요청 실패(네트워크/서버 오류)");
    } finally {
      // setLoading(false);
    }
  };

  // 화면 렌더링
  return (
    <div className="page">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1 className="auth-title">회원가입</h1>
          <p className="auth-sub">커뮤니티의 새로운 멤버가 되어주세요</p>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {/* 이름 */}
            <label className="field">
              <span>이름</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
              />
            </label>

            {/* 이메일 */}
            <div className="field">
              <span>이메일</span>
              <div className="row">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  onBlur={checkEmailDup}
                />
                <button
                  type="button"
                  className="btn-outline"
                  onClick={checkEmailDup}
                  disabled={emailStatus === "checking"}
                >
                  중복확인
                </button>
              </div>

              {emailStatus !== "idle" && (
                <div
                  className={
                    "hint " +
                    (emailStatus === "available"
                      ? "ok"
                      : emailStatus === "checking"
                      ? "info"
                      : "err")
                  }
                >
                  {emailMsg}
                </div>
              )}
            </div>

            {/* 비밀번호 */}
            <label className="field">
              <span>비밀번호</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
              />
              <div className="pw-rules">
                <div className={pwCheck.lengthOk ? "ok" : "err"}>• 8~20자</div>
                <div className={pwCheck.typesOk ? "ok" : "err"}>
                  • 영문/숫자/특수문자 2종 이상
                </div>
              </div>
            </label>

            {/* 비밀번호 확인 */}
            <label className="field">
              <span>비밀번호 확인</span>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleInputChange}
              />
              {form.password2 && (
                <div className={"hint " + (passwordMatch ? "ok" : "err")}>
                  {passwordMatch
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."}
                </div>
              )}
            </label>

            {/* 약관 동의 */}
            <label className="checkbox">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleInputChange}
              />
              <span>
                <Link to="/terms">이용약관</Link>에 동의합니다
              </span>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={form.agreePrivacy}
                onChange={handleInputChange}
              />
              <span>
                <Link to="/privacy">개인정보처리방침</Link>에 동의합니다
              </span>
            </label>

            {/* 회원가입 버튼 */}
            <button
              className="btn-primary"
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
            >
              회원가입
            </button>

            <div className="auth-footer">
              이미 회원이신가요? <Link to="/app/login">로그인</Link>
            </div>
          </form>
        </div>

        <div className="back-home">
          <Link to="/mainpage">← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
