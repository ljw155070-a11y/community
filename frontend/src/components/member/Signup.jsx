import { Link } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  return (
    <div className="page">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1 className="auth-title">회원가입</h1>
          <p className="auth-sub">커뮤니티의 새로운 멤버가 되어주세요</p>

          <form className="auth-form">
            <label className="field">
              <span>이름</span>
              <input type="text" placeholder="ex) 홍길동" />
            </label>

            <label className="field">
              <span>이메일</span>
              <input type="email" placeholder="ex) user001@gmail.com" />
            </label>

            <label className="field">
              <span>비밀번호</span>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요 (8자 이상)"
              />
            </label>

            <label className="field">
              <span>비밀번호 확인</span>
              <input type="password" placeholder="비밀번호를 다시 입력하세요" />
            </label>

            <label className="checkbox">
              <input type="checkbox" />
              <span>
                <Link to="/terms">이용약관</Link>에 동의합니다 (필수)
              </span>
            </label>

            <label className="checkbox">
              <input type="checkbox" />
              <span>
                <Link to="/privacy">개인정보처리방침</Link>에 동의합니다 (필수)
              </span>
            </label>

            <button className="btn-primary" type="button">
              회원가입
            </button>

            <div className="auth-footer">
              이미 회원이신가요? <Link to="/login">로그인</Link>
            </div>
          </form>
        </div>
        <div className="back-home">
          <Link to="/">← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
