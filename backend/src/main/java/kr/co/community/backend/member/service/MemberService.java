package kr.co.community.backend.member.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.co.community.backend.util.JwtUtil;
import kr.co.community.backend.member.dao.MemberDao;
import kr.co.community.backend.member.dto.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberDao memberDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // =========================
    // 중복 체크
    // =========================

    public boolean emailExists(String email) {
        return memberDao.countByEmail(email) > 0;
    }

    public boolean checkEmailDuplicate(String email) {
        return memberDao.selectMemberByEmail(email) != null;
    }

    public boolean checkNicknameDuplicate(String nickname) {
        return memberDao.countByNickname(nickname) > 0;
    }

    /**
     * 이메일로 회원 정보 조회
     */
    public MemberDTO getMemberByEmail(String email) {
        return memberDao.selectMemberByEmail(email);
    }

    // =========================
    // 회원가입
    // =========================

    /**
     * 회원가입
     * - role/status 기본값
     * - 필수값 검증
     * - 비밀번호 해시
     * - 닉네임 자동 생성 (이름 기반)
     */
    @Transactional
    public int signup(MemberDTO dto) {

        log.info("📝 회원가입 시도: {}", dto.getEmail());

        // ✅ NOT NULL 기본값 대응
        if (dto.getRole() == null || dto.getRole().isBlank()) dto.setRole("USER");
        if (dto.getStatus() == null || dto.getStatus().isBlank()) dto.setStatus("ACTIVE");

        // ✅ 필수값 방어
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("name은 필수입니다.");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("email은 필수입니다.");
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("password는 필수입니다.");
        }

        // ✅ 이메일 중복 체크
        if (emailExists(dto.getEmail())) {
            log.warn("❌ 이메일 중복: {}", dto.getEmail());
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // ✅ 비밀번호 해시 (PasswordEncoder 사용)
        dto.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        // ✅ 닉네임 자동 생성
        dto.setNickname(generateNickname(dto.getName()));

        // ✅ insert
        int result = memberDao.insertMember(dto);

        log.info("✅ 회원가입 성공: {} (memberId={})", dto.getEmail(), dto.getMemberId());

        return result;
    }

    // 이름 그대로 먼저 쓰고, 있으면 #0001, #0002...
    private String generateNickname(String baseName) {
        String base = baseName.trim();

        // 1) 이름 그대로 가능하면 그대로 사용
        if (memberDao.countByNickname(base) == 0) {
            return base;
        }

        // 2) 이미 있으면 suffix 최대값 조회 후 +1
        Integer maxSuffix = memberDao.selectMaxNicknameSuffix(base);
        int next = (maxSuffix == null ? 0 : maxSuffix) + 1;

        String nick = base + "#" + String.format("%04d", next);

        // 3) (동시 가입 레이스) 아주 드물게 충돌하면 몇 번 더 밀어준다
        int tries = 0;
        while (memberDao.countByNickname(nick) > 0) {
            tries++;
            next++;
            nick = base + "#" + String.format("%04d", next);
            if (tries > 20) throw new RuntimeException("닉네임 자동 생성 실패");
        }

        return nick;
    }

    // =========================
    // 로그인 (JWT)
    // =========================

    /**
     * 로그인 (JWT 토큰 반환)
     */
    @Transactional
    public String login(String email, String password) {
        log.info("🔐 로그인 시도: {}", email);

        // 1) 이메일로 회원 조회
        MemberDTO member = memberDao.selectMemberByEmail(email);

        if (member == null) {
            log.warn("❌ 존재하지 않는 이메일: {}", email);
            throw new RuntimeException("존재하지 않는 이메일입니다.");
        }

        // 2) 비밀번호 확인
        if (!passwordEncoder.matches(password, member.getPasswordHash())) {
            log.warn("❌ 비밀번호 불일치: {}", email);
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 3) 계정 상태 확인
        if (!"ACTIVE".equals(member.getStatus())) {
            log.warn("❌ 비활성화된 계정: {}", email);
            throw new RuntimeException("비활성화된 계정입니다.");
        }

        // 4) 마지막 로그인 시간 업데이트
        // ※ 아래 DAO 메서드가 실제로 있어야 함 (없으면 DAO/Mapper에 추가 필요)
        memberDao.updateLastLoginAt(member.getMemberId());

        // 5) JWT 토큰 생성
        String token = jwtUtil.generateToken(
            member.getMemberId(),
            member.getEmail(),
            member.getName(),
            member.getNickname()
        );

        log.info("✅ 로그인 성공: {} (memberId={})", email, member.getMemberId());
        return token;
    }

    /**
     * JWT 토큰에서 memberId 추출
     */
    public Long getMemberIdFromToken(String token) {
        return jwtUtil.getMemberIdFromToken(token);
    }

    // =========================
    // 마이페이지 기능
    // =========================

    /**
     * 회원 정보 조회
     */
    public MemberDTO getMemberInfo(Long memberId) {
        return memberDao.selectMemberById(memberId);
    }

    /**
     * 회원 활동 통계 조회 (작성글/댓글/받은좋아요)
     */
    public Map<String, Object> getMemberStats(Long memberId) {
        Map<String, Object> stats = new HashMap<>();

        int postsCount = memberDao.countMemberPosts(memberId);
        stats.put("postsWritten", postsCount);

        int commentsCount = memberDao.countMemberComments(memberId);
        stats.put("commentsWritten", commentsCount);

        int likesCount = memberDao.countReceivedLikes(memberId);
        stats.put("receivedLikes", likesCount);

        return stats;
    }

    /**
     * 회원이 작성한 글 목록 조회
     */
    public List<Map<String, Object>> getMemberPosts(Long memberId) {
        return memberDao.selectMemberPosts(memberId);
    }

    /**
     * 회원이 작성한 댓글 목록 조회
     */
    public List<Map<String, Object>> getMemberComments(Long memberId) {
        return memberDao.selectMemberComments(memberId);
    }

    /**
     * 회원이 좋아요한 글 목록 조회
     */
    public List<Map<String, Object>> getMemberLikedPosts(Long memberId) {
        return memberDao.selectMemberLikedPosts(memberId);
    }
    
    @Transactional
    public Long register(MemberDTO memberDTO) {
        log.info("📝 회원가입(API) 시도: {}", memberDTO.getEmail());

        // ✅ 기존 signup이 password는 dto.getPassword()를 기대함
        // API에서 passwordHash에 평문이 들어오는 구조라면 password로 옮겨준다.
        // (둘 중 하나만 와도 동작하게)
        if ((memberDTO.getPassword() == null || memberDTO.getPassword().isBlank())
            && (memberDTO.getPasswordHash() != null && !memberDTO.getPasswordHash().isBlank())) {
            memberDTO.setPassword(memberDTO.getPasswordHash());
        }

        // signup(MemberDTO)는 닉네임 자동생성/role/status 기본값/필수값검증/암호화까지 포함
        int rows = signup(memberDTO);

        if (rows != 1) {
            throw new RuntimeException("회원가입에 실패했습니다.");
        }

        return memberDTO.getMemberId(); // insert 후 key가 세팅되는 구조여야 함 (MyBatis useGeneratedKeys 등)
    }

}
