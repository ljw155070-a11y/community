package kr.co.community.backend.member.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.member.dto.MemberDTO;

@Mapper
public interface MemberDao {

    int countByEmail(@Param("email") String email);

    int countByNickname(@Param("nickname") String nickname);

    Integer selectMaxNicknameSuffix(@Param("base") String base);

    int insertMember(MemberDTO dto);

    MemberDTO selectMemberByEmail(String username);

    // ========== 마이페이지 ==========
    MemberDTO selectMemberById(@Param("memberId") Long memberId);

    int countMemberPosts(@Param("memberId") Long memberId);

    int countMemberComments(@Param("memberId") Long memberId);

    int countReceivedLikes(@Param("memberId") Long memberId);

    List<Map<String, Object>> selectMemberPosts(@Param("memberId") Long memberId);

    List<Map<String, Object>> selectMemberComments(@Param("memberId") Long memberId);

    List<Map<String, Object>> selectMemberLikedPosts(@Param("memberId") Long memberId);

    void updateLastLoginAt(@Param("memberId") Long memberId);

    // ✅ 프로필 이미지 업데이트
    int updateProfileImage(@Param("memberId") Long memberId, @Param("saveName") String saveName);

    // ========== 아이디/비번 찾기 ==========
    MemberDTO selectMemberByNameAndEmail(@Param("name") String name, @Param("email") String email);

    MemberDTO selectMemberByEmailAndName(@Param("email") String email, @Param("name") String name);

    int updatePassword(@Param("memberId") Long memberId, @Param("passwordHash") String passwordHash);
}
