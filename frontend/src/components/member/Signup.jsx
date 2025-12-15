// =========================
// 1) import 구역
// =========================

// react-router-dom에서 Link 컴포넌트를 가져옴
// Link는 화면 새로고침 없이 SPA 내부 라우팅을 해주는 컴포넌트이고,
// 실제 DOM에서는 <a>로 렌더링됨
import { Link } from "react-router-dom";

// React에서 상태/메모 관련 훅을 가져옴
// useState: 상태(state)를 저장하고 바꿀 때 사용
// useMemo: 특정 계산 결과를 기억해두고, 의존성이 바뀔 때만 다시 계산
import { useMemo, useState } from "react";

// axios는 HTTP 요청(GET/POST 등)을 편하게 보내는 라이브러리
import axios from "axios";

// 이 컴포넌트 전용 CSS 파일을 import (번들링 시 같이 적용됨)
import "./signup.css";

// =========================
// 2) 상수/유틸 함수 구역
// =========================

// 이메일 형식이 맞는지 검사하는 정규식
// 예: test("a@b.com") => true
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 비밀번호를 정책에 맞게 검증하는 함수(arrow function)
// pw를 받아서 여러 조건을 검사하고 결과 객체를 반환
const validatePassword = (pw) => {
  // 길이 조건: 8~20자 인지 검사
  const lengthOk = pw.length >= 8 && pw.length <= 20;

  // 영문이 포함되어 있는지 검사
  const hasLetter = /[A-Za-z]/.test(pw);

  // 숫자가 포함되어 있는지 검사
  const hasNumber = /[0-9]/.test(pw);

  // 특수문자가 포함되어 있는지 검사 (영문/숫자가 아닌 문자)
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);

  // 영문/숫자/특수 중 true인 것만 남기고 개수를 센다
  // 예: [true, true, false] => 2
  const types = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  // 2종 이상 포함했는지 검사
  const typesOk = types >= 2;

  // 결과를 객체로 반환
  // ok는 "최종 통과" 여부
  return {
    lengthOk, // 길이OK인지
    hasLetter, // 영문 포함인지
    hasNumber, // 숫자 포함인지
    hasSpecial, // 특수 포함인지
    typesOk, // 2종 이상인지
    ok: lengthOk && typesOk, // 최종 통과 여부
  };
};

// =========================
// 3) 컴포넌트 본문 (arrow function)
// =========================

// Signup 컴포넌트 선언 (arrow function)
// export default는 파일 맨 아래에서 한다 (통일)
const Signup = () => {
  // -------------------------
  // 3-1) 상태(state) 선언
  // -------------------------

  // form이라는 객체 상태를 만들고, setForm으로 변경할 수 있다
  const [form, setForm] = useState({
    name: "", // 이름 입력값
    email: "", // 이메일 입력값
    password: "", // 비밀번호 입력값
    password2: "", // 비밀번호 확인 입력값
    agreeTerms: false, // 이용약관 동의 여부
    agreePrivacy: false, // 개인정보 동의 여부
  });

  // 이메일 중복 체크 상태를 저장하는 state
  // idle | checking | available | duplicated | invalid
  const [emailStatus, setEmailStatus] = useState("idle");

  // 이메일 중복 체크 결과 메시지
  const [emailMsg, setEmailMsg] = useState("");

  // -------------------------
  // 3-2) 파생 값(계산 결과)들
  // -------------------------

  // 비밀번호 검증 결과를 pwCheck에 저장
  // form.password가 바뀔 때만 validatePassword를 재실행하도록 useMemo 사용
  const pwCheck = useMemo(() => {
    // 현재 password로 검증 실행
    return validatePassword(form.password);
  }, [form.password]); // password가 바뀔 때만 다시 계산

  // 비밀번호와 확인 비밀번호가 같은지 검사
  // password가 비어있으면 false 처리하려고 length > 0 조건을 추가
  const passwordMatch =
    form.password.length > 0 && form.password === form.password2;

  // 이메일 형식이 맞는지 검사
  const emailValid = EMAIL_REGEX.test(form.email);

  // 회원가입 버튼을 활성화할지 여부 (true면 활성화, false면 비활성화)
  const canSubmit =
    form.name.trim().length >= 2 && // 이름 2글자 이상
    emailStatus === "available" && // 이메일 중복체크 결과가 사용가능
    pwCheck.ok && // 비밀번호 정책 통과
    passwordMatch && // 비밀번호 확인 일치
    form.agreeTerms && // 약관 동의 체크
    form.agreePrivacy; // 개인정보 동의 체크

  // -------------------------
  // 3-3) 이벤트 핸들러들
  // -------------------------

  // input/checkbox 공통 onChange 핸들러 (커링 형태)
  // onChange("name") 처럼 쓰면 key가 "name"으로 고정된 함수가 만들어짐
  const onChange = (key) => {
    // 실제 이벤트(e)를 받는 함수를 반환
    return (e) => {
      // 체크박스면 checked 값을 쓰고, 아니면 value를 쓴다
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;

      // form 상태를 업데이트한다 (이전값(prev)을 기준으로 변경)
      setForm((prev) => {
        // prev를 복사하고, 해당 key만 새 value로 덮어쓴다
        return { ...prev, [key]: value };
      });

      // 이메일이 변경되면 중복체크 결과는 더 이상 유효하지 않으므로 리셋한다
      if (key === "email") {
        setEmailStatus("idle"); // 상태 초기화
        setEmailMsg(""); // 메시지 초기화
      }
    };
  };

  // 이메일 중복 체크 함수 (서버 호출)
  const checkEmailDup = async () => {
    // 이메일 형식이 잘못되면 서버를 호출하지 않고 여기서 끝낸다
    if (!emailValid) {
      setEmailStatus("invalid"); // 잘못된 이메일
      setEmailMsg("이메일 형식이 올바르지 않습니다."); // 안내 메시지
      return; // 함수 종료
    }

    try {
      // 요청 시작: checking 상태로 바꾸고 메시지 표시
      setEmailStatus("checking");
      setEmailMsg("중복 확인 중...");

      // axios GET 요청
      // params는 ?email=... 형태로 쿼리스트링이 된다
      const res = await axios.get(
        "http://localhost:9999/api/auth/email-exists",
        {
          params: {
            email: form.email, // 현재 입력된 이메일
          },
        }
      );

      // 서버가 { exists: true/false }로 준다고 가정
      // true면 이미 존재(중복)
      if (res.data?.exists) {
        setEmailStatus("duplicated"); // 중복 상태
        setEmailMsg("이미 사용 중인 이메일입니다."); // 안내 메시지
      } else {
        setEmailStatus("available"); // 사용 가능 상태
        setEmailMsg("사용 가능한 이메일입니다."); // 안내 메시지
      }
    } catch (err) {
      // 서버 오류, 네트워크 오류, CORS 오류 등으로 실패할 경우
      setEmailStatus("idle"); // 상태를 기본으로 돌리고
      setEmailMsg("중복 확인에 실패했습니다. 잠시 후 다시 시도해주세요."); // 메시지 표시
    }
  };

  // 회원가입 버튼 클릭 시 실행되는 함수
  const onSubmit = async () => {
    // 제출 조건을 만족하지 않으면 아무것도 하지 않는다
    if (!canSubmit) return;

    // TODO: 실제 회원가입 API 연결 위치
    // 예: await axios.post("http://localhost:9999/api/auth/signup", payload);

    // 지금은 콘솔로만 출력
    console.log("회원가입 요청", form);
  };

  // -------------------------
  // 3-4) 화면 렌더링(return JSX)
  // -------------------------

  return (
    // page: 배경 + 가운데 정렬을 담당
    <div className="page">
      {/* auth-wrap: 카드 + 하단 링크를 묶어서 가운데 정렬 */}
      <div className="auth-wrap">
        {/* auth-card: 흰색 카드 박스 */}
        <div className="auth-card">
          {/* 타이틀 */}
          <h1 className="auth-title">회원가입</h1>

          {/* 서브 텍스트 */}
          <p className="auth-sub">커뮤니티의 새로운 멤버가 되어주세요</p>

          {/* form: 엔터로 submit되는 기본 동작을 막기 위해 preventDefault */}
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {/* 이름 입력 */}
            <label className="field">
              {/* 라벨 텍스트 */}
              <span>이름</span>

              {/* 이름 input (controlled input: value와 state 연결) */}
              <input
                type="text" // 텍스트 입력
                placeholder="ex) 홍길동" // 안내 문구
                value={form.name} // 상태값을 화면에 표시
                onChange={onChange("name")} // 입력 시 상태 업데이트
              />
            </label>

            {/* 이메일 입력 + 중복 체크 */}
            <div className="field">
              {/* 라벨 텍스트 */}
              <span>이메일</span>

              {/* row: input과 버튼을 가로로 배치 */}
              <div className="row">
                {/* 이메일 input */}
                <input
                  type="email" // 이메일 입력
                  placeholder="ex) user001@gmail.com" // 안내 문구
                  value={form.email} // 상태값 표시
                  onChange={onChange("email")} // 변경 시 상태 업데이트 + 중복체크 리셋
                  onBlur={checkEmailDup} // 포커스 빠질 때 중복 체크
                />

                {/* 중복확인 버튼 */}
                <button
                  type="button" // submit 버튼이 아니라 일반 버튼
                  className="btn-outline" // 테두리 버튼 스타일
                  onClick={checkEmailDup} // 클릭 시 중복 체크 실행
                  disabled={emailStatus === "checking" || !form.email} // 요청 중이거나 이메일이 비면 비활성화
                >
                  {/* 버튼 텍스트 */}
                  중복확인
                </button>
              </div>

              {/* 상태가 idle이 아닐 때만 메시지를 보여줌 */}
              {emailStatus !== "idle" && (
                <div
                  className={
                    // hint 기본 클래스 + 상태별 클래스(ok/info/err) 추가
                    "hint " +
                    (emailStatus === "available"
                      ? "ok"
                      : emailStatus === "checking"
                      ? "info"
                      : "err")
                  }
                >
                  {/* 화면에 보여줄 메시지 */}
                  {emailMsg}
                </div>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <label className="field">
              {/* 라벨 텍스트 */}
              <span>비밀번호</span>

              {/* 비밀번호 input */}
              <input
                type="password" // 비밀번호 입력(가려짐)
                placeholder="비밀번호를 입력하세요 (8자 이상)" // 안내 문구
                value={form.password} // 상태값 표시
                onChange={onChange("password")} // 변경 시 상태 업데이트
              />

              {/* 비밀번호 규칙 안내 */}
              <div className="pw-rules">
                {/* 길이 조건 표시 */}
                <div className={pwCheck.lengthOk ? "ok" : "err"}>• 8~20자</div>

                {/* 2종 이상 조건 표시 */}
                <div className={pwCheck.typesOk ? "ok" : "err"}>
                  • 영문/숫자/특수문자 중 2종 이상
                </div>
              </div>
            </label>

            {/* 비밀번호 확인 입력 */}
            <label className="field">
              {/* 라벨 텍스트 */}
              <span>비밀번호 확인</span>

              {/* 비밀번호 확인 input */}
              <input
                type="password" // 비밀번호 입력(가려짐)
                placeholder="비밀번호를 다시 입력하세요" // 안내 문구
                value={form.password2} // 상태값 표시
                onChange={onChange("password2")} // 변경 시 상태 업데이트
              />

              {/* password2를 입력하기 시작했을 때만 안내 문구 표시 */}
              {form.password2.length > 0 && (
                <div className={"hint " + (passwordMatch ? "ok" : "err")}>
                  {/* 일치하면 ok, 아니면 err 메시지 */}
                  {passwordMatch
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."}
                </div>
              )}
            </label>

            {/* 이용약관 동의 체크 */}
            <label className="checkbox">
              {/* 체크박스 */}
              <input
                type="checkbox" // 체크박스
                checked={form.agreeTerms} // 상태값 표시
                onChange={onChange("agreeTerms")} // 체크 변경 시 상태 업데이트
              />

              {/* 문구 */}
              <span>
                {/* 약관 페이지로 이동하는 Link */}
                <Link to="/terms">이용약관</Link>에 동의합니다 (필수)
              </span>
            </label>

            {/* 개인정보처리방침 동의 체크 */}
            <label className="checkbox">
              {/* 체크박스 */}
              <input
                type="checkbox" // 체크박스
                checked={form.agreePrivacy} // 상태값 표시
                onChange={onChange("agreePrivacy")} // 체크 변경 시 상태 업데이트
              />

              {/* 문구 */}
              <span>
                {/* 개인정보처리방침 페이지로 이동하는 Link */}
                <Link to="/privacy">개인정보처리방침</Link>에 동의합니다 (필수)
              </span>
            </label>

            {/* 회원가입 버튼 */}
            <button
              className="btn-primary" // 파란 버튼 스타일
              type="button" // submit이 아니라 일반 버튼
              onClick={onSubmit} // 클릭 시 회원가입 함수 실행
              disabled={!canSubmit} // 조건 미충족이면 비활성화
            >
              {/* 버튼 텍스트 */}
              회원가입
            </button>

            {/* 하단 로그인 링크 */}
            <div className="auth-footer">
              {/* 안내 문구 + Link */}
              이미 회원이신가요? <Link to="/login">로그인</Link>
            </div>
          </form>
        </div>

        {/* 카드 밖: 홈으로 돌아가기 */}
        <div className="back-home">
          {/* 홈으로 이동 */}
          <Link to="/">← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

// 컴포넌트를 다른 곳에서 import할 수 있도록 export default
export default Signup;
