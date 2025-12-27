package kr.co.community.backend.member.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.co.community.backend.member.dao.LoginSessionMapper;
import kr.co.community.backend.member.dao.MemberDao;
import kr.co.community.backend.member.dto.LoginSessionDTO;
import kr.co.community.backend.member.dto.MemberDTO;
import kr.co.community.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberDao memberDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginSessionMapper loginSessionMapper;

    // ✅ WebMvcConfig와 동일한 경로 (기본값도 동일)
    @Value("${file.upload.path:C:/uploads/community}")
    private String uploadPath;

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

    public MemberDTO getMemberByEmail(String email) {
        return memberDao.selectMemberByEmail(email);
    }

    // =========================
    // 회원가입
    // =========================
    @Transactional
    public int signup(MemberDTO dto) {

        log.info("📝 회원가입 시도: {}", dto.getEmail());

        if (dto.getRole() == null || dto.getRole().isBlank()) dto.setRole("USER");
        if (dto.getStatus() == null || dto.getStatus().isBlank()) dto.setStatus("ACTIVE");

        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("name은 필수입니다.");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("email은 필수입니다.");
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("password는 필수입니다.");
        }

        if (emailExists(dto.getEmail())) {
            log.warn("❌ 이메일 중복: {}", dto.getEmail());
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        dto.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        dto.setNickname(generateNickname(dto.getName()));

        int result = memberDao.insertMember(dto);

        log.info("✅ 회원가입 성공: {} (memberId={})", dto.getEmail(), dto.getMemberId());

        return result;
    }

    private String generateNickname(String baseName) {
        String base = baseName.trim();

        if (memberDao.countByNickname(base) == 0) {
            return base;
        }

        Integer maxSuffix = memberDao.selectMaxNicknameSuffix(base);
        int next = (maxSuffix == null ? 0 : maxSuffix) + 1;

        String nick = base + "#" + String.format("%04d", next);

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

    @Transactional
    public String login(String email, String password) {
        log.info("🔐 로그인 시도: {}", email);

        MemberDTO member = memberDao.selectMemberByEmail(email);

        if (member == null) {
            log.warn("❌ 존재하지 않는 이메일: {}", email);
            throw new RuntimeException("존재하지 않는 이메일입니다.");
        }

        if (!passwordEncoder.matches(password, member.getPasswordHash())) {
            log.warn("❌ 비밀번호 불일치: {}", email);
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        if (!"ACTIVE".equals(member.getStatus())) {
            log.warn("❌ 비활성화된 계정: {}", email);
            throw new RuntimeException("비활성화된 계정입니다.");
        }

        // 중복 로그인 세션 삭제
        LoginSessionDTO existSession = loginSessionMapper.findByMemberId(member.getMemberId());
        if (existSession != null) {
            loginSessionMapper.deleteByMemberId(member.getMemberId());
            log.info("🔄 기존 세션 삭제: memberId={}", member.getMemberId());
        }

        memberDao.updateLastLoginAt(member.getMemberId());

        String token = jwtUtil.generateToken(
            member.getMemberId(),
            member.getEmail(),
            member.getName(),
            member.getNickname()
        );

        LoginSessionDTO newSession = new LoginSessionDTO();
        newSession.setMemberId(member.getMemberId());
        newSession.setToken(token);
        newSession.setLoginIp("127.0.0.1");
        newSession.setExpireTime(jwtUtil.getExpirationFromToken(token));

        loginSessionMapper.save(newSession);
        log.info("💾 새 세션 저장: memberId={}", member.getMemberId());

        log.info("✅ 로그인 성공: {} (memberId={})", email, member.getMemberId());
        return token;
    }

    public Long getMemberIdFromToken(String token) {
        return jwtUtil.getMemberIdFromToken(token);
    }

    // =========================
    // 마이페이지
    // =========================

    public MemberDTO getMemberInfo(Long memberId) {
        return memberDao.selectMemberById(memberId);
    }

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

    public List<Map<String, Object>> getMemberPosts(Long memberId) {
        return memberDao.selectMemberPosts(memberId);
    }

    public List<Map<String, Object>> getMemberComments(Long memberId) {
        return memberDao.selectMemberComments(memberId);
    }

    public List<Map<String, Object>> getMemberLikedPosts(Long memberId) {
        return memberDao.selectMemberLikedPosts(memberId);
    }

    // ✅ 프로필 이미지 저장 (WebMvcConfig 경로와 완전히 일치)
    @Transactional
    public String saveProfileImage(Long memberId, MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("파일이 없습니다.");
        }

        MemberDTO member = memberDao.selectMemberById(memberId);
        if (member == null) {
            throw new RuntimeException("회원이 존재하지 않습니다.");
        }

        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf("."))
                : "";

        String saveName = "profile_" + memberId + "_" + System.currentTimeMillis() + ext;

        Path dir = Paths.get(uploadPath);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }

        Path target = dir.resolve(saveName);
        file.transferTo(target.toFile());

        memberDao.updateProfileImage(memberId, saveName);

        return saveName;
    }

    // =========================
    // API 회원가입(register)
    // =========================
    @Transactional
    public Long register(MemberDTO memberDTO) {
        log.info("📝 회원가입(API) 시도: {}", memberDTO.getEmail());

        if ((memberDTO.getPassword() == null || memberDTO.getPassword().isBlank())
            && (memberDTO.getPasswordHash() != null && !memberDTO.getPasswordHash().isBlank())) {
            memberDTO.setPassword(memberDTO.getPasswordHash());
        }

        int rows = signup(memberDTO);

        if (rows != 1) {
            throw new RuntimeException("회원가입에 실패했습니다.");
        }

        return memberDTO.getMemberId();
    }

    // =========================
    // 아이디/비번 찾기
    // =========================

    public MemberDTO findIdByNameAndEmail(String name, String email) {
        log.info("🔍 아이디 찾기 시도: name={}, email={}", name, email);

        MemberDTO member = memberDao.selectMemberByNameAndEmail(name, email);

        if (member == null) {
            log.warn("❌ 일치하는 회원 정보 없음: name={}, email={}", name, email);
            return null;
        }

        member.setPasswordHash(null);

        log.info("✅ 아이디 찾기 성공: memberId={}, email={}", member.getMemberId(), member.getEmail());
        return member;
    }

    public boolean verifyAccountByEmailAndName(String email, String name) {
        log.info("🔍 계정 확인 시도: email={}, name={}", email, name);

        MemberDTO member = memberDao.selectMemberByEmailAndName(email, name);

        if (member == null) {
            log.warn("❌ 일치하는 회원 정보 없음: email={}, name={}", email, name);
            return false;
        }

        if (!"ACTIVE".equals(member.getStatus())) {
            log.warn("❌ 비활성화된 계정: email={}, status={}", email, member.getStatus());
            return false;
        }

        log.info("✅ 계정 확인 성공: memberId={}", member.getMemberId());
        return true;
    }

    @Transactional
    public boolean resetPassword(String email, String newPassword) {
        log.info("🔐 비밀번호 재설정 시도: email={}", email);

        MemberDTO member = memberDao.selectMemberByEmail(email);

        if (member == null) {
            log.warn("❌ 존재하지 않는 이메일: {}", email);
            return false;
        }

        if (!"ACTIVE".equals(member.getStatus())) {
            log.warn("❌ 비활성화된 계정: email={}, status={}", email, member.getStatus());
            return false;
        }

        String hashedPassword = passwordEncoder.encode(newPassword);

        int result = memberDao.updatePassword(member.getMemberId(), hashedPassword);

        if (result == 1) {
            log.info("✅ 비밀번호 재설정 성공: memberId={}", member.getMemberId());
            return true;
        } else {
            log.error("❌ 비밀번호 업데이트 실패: memberId={}", member.getMemberId());
            return false;
        }
    }
}
