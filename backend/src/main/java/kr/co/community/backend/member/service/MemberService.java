package kr.co.community.backend.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.co.community.backend.member.dao.MemberDao;
import kr.co.community.backend.member.dto.MemberDTO;

@Service
public class MemberService {

  @Autowired
  private MemberDao memberDao;

  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public boolean emailExists(String email) {
    return memberDao.countByEmail(email) > 0;
  }

  public int signup(MemberDTO dto) {

    // ✅ NOT NULL 기본값 대응
    if (dto.getRole() == null || dto.getRole().isBlank()) dto.setRole("USER");
    if (dto.getStatus() == null || dto.getStatus().isBlank()) dto.setStatus("ACTIVE");

    // ✅ 필수값 방어 (DB NOT NULL 터지기 전에 백엔드에서 막기)
    if (dto.getName() == null || dto.getName().isBlank()) {
      throw new IllegalArgumentException("name은 필수입니다.");
    }
    if (dto.getEmail() == null || dto.getEmail().isBlank()) {
      throw new IllegalArgumentException("email은 필수입니다.");
    }
    if (dto.getPassword() == null || dto.getPassword().isBlank()) {
      throw new IllegalArgumentException("password는 필수입니다.");
    }

    // ✅ 비밀번호 해시
    dto.setPasswordHash(encoder.encode(dto.getPassword()));

    // ✅ 닉네임 자동 생성 (이름 그대로 -> 중복이면 #0001 증가)
    dto.setNickname(generateNickname(dto.getName()));

    // ✅ insert
    return memberDao.insertMember(dto);
  }

  // 이름 그대로 먼저 쓰고, 있으면 #0001, #0002...
  private String generateNickname(String baseName) {
    String base = baseName.trim();

    // 1) 이름 그대로 가능하면 그대로 사용
    if (memberDao.countByNickname(base) == 0) {
      return base;
    }

    // 2) 이미 있으면 suffix 최대값 조회 후 +1
    int next = (memberDao.selectMaxNicknameSuffix(base) == null ? 0 : memberDao.selectMaxNicknameSuffix(base)) + 1;
    String nick = base + "#" + String.format("%04d", next);

    // 3) (동시 가입 레이스) 아주 드물게 충돌하면 몇 번 더 밀어준다
    //    UNIQUE 제약이 마지막 방어선이라 안전함
    int tries = 0;
    while (memberDao.countByNickname(nick) > 0) {
      tries++;
      next++;
      nick = base + "#" + String.format("%04d", next);
      if (tries > 20) throw new RuntimeException("닉네임 자동 생성 실패");
    }

    return nick;
  }
  //========== 로그인 기능 (추가) ==========
  public MemberDTO login(String email, String password) {
      
      MemberDTO member = memberDao.selectMemberByEmail(email);
      
      if (member == null) {
          return null;
      }
      
      if (encoder.matches(password, member.getPasswordHash())) {
          member.setPasswordHash(null);
          return member;
      }
      
      return null;
  }
}
