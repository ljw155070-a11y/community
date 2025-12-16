package kr.co.community.backend.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.backend.member.dao.MemberDao;
import kr.co.community.backend.member.dto.MemberDTO;

@Service
public class MemberService {

    @Autowired
    private MemberDao memberDao;

    public boolean emailExists(String email) {
        return memberDao.countByEmail(email) > 0;
    }

    public int signup(MemberDTO dto) {
        // 기본값 세팅 (NOT NULL 대응)
        if (dto.getRole() == null || dto.getRole().isBlank()) dto.setRole("USER");
        if (dto.getStatus() == null || dto.getStatus().isBlank()) dto.setStatus("ACTIVE");

        // TODO: 나중에 dto.passwordHash에 BCrypt 적용해서 넣기
        return memberDao.insertMember(dto);
    }
}