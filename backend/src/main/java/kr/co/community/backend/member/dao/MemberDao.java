package kr.co.community.backend.member.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.member.dto.MemberDTO;

@Mapper
public interface MemberDao {

    int countByEmail(@Param("email") String email);

    // ✅ 닉네임이 이미 존재하는지
    int countByNickname(@Param("nickname") String nickname);

    // ✅ base(이름)로 시작하는 "이름#0001" 패턴 중 최대 suffix 조회
    Integer selectMaxNicknameSuffix(@Param("base") String base);
    
    int insertMember(MemberDTO dto);
    
    MemberDTO selectMemberByEmail(String username);
    
//========== 마이페이지 관련 메서드 ==========
    
    /**
     * 회원 ID로 회원 정보 조회
     * @param memberId 회원 ID
     * @return MemberDTO
     */
    MemberDTO selectMemberById(@Param("memberId") Long memberId);

    /**
     * 회원이 작성한 글 개수 조회
     * @param memberId 회원 ID
     * @return 작성한 글 개수
     */
    int countMemberPosts(@Param("memberId") Long memberId);

    /**
     * 회원이 작성한 댓글 개수 조회
     * @param memberId 회원 ID
     * @return 작성한 댓글 개수
     */
    int countMemberComments(@Param("memberId") Long memberId);

    /**
     * 회원이 받은 좋아요 개수 조회
     * @param memberId 회원 ID
     * @return 받은 좋아요 개수
     */
    int countReceivedLikes(@Param("memberId") Long memberId);

    /**
     * 회원이 작성한 글 목록 조회
     * @param memberId 회원 ID
     * @return 작성한 글 목록
     */
    List<Map<String, Object>> selectMemberPosts(@Param("memberId") Long memberId);

    /**
     * 회원이 작성한 댓글 목록 조회
     * @param memberId 회원 ID
     * @return 작성한 댓글 목록
     */
    List<Map<String, Object>> selectMemberComments(@Param("memberId") Long memberId);

    /**
     * 회원이 좋아요한 글 목록 조회
     * @param memberId 회원 ID
     * @return 좋아요한 글 목록
     */
    List<Map<String, Object>> selectMemberLikedPosts(@Param("memberId") Long memberId);
    
    /**
     * 이메일로 회원 조회
     */
    MemberDTO selectByEmail(@Param("email") String email);

    /**
     * ID로 회원 조회
     */
    MemberDTO selectById(@Param("memberId") Long memberId);

    /**
     * 마지막 로그인 시간 업데이트
     */
    void updateLastLoginAt(@Param("memberId") Long memberId);
    
// ========== 아이디/비밀번호 찾기 관련 메서드 ==========
    
    /**
     * 이름과 이메일로 회원 조회 (아이디 찾기용)
     * @param name 회원 이름
     * @param email 회원 이메일
     * @return 회원 정보 (이메일 포함)
     */
    MemberDTO selectMemberByNameAndEmail(
        @Param("name") String name, 
        @Param("email") String email
    );

    /**
     * 이메일과 이름으로 회원 조회 (계정 확인용)
     * @param email 회원 이메일
     * @param name 회원 이름
     * @return 회원 정보
     */
    MemberDTO selectMemberByEmailAndName(
        @Param("email") String email, 
        @Param("name") String name
    );

    /**
     * 비밀번호 업데이트
     * @param memberId 회원 ID
     * @param passwordHash 암호화된 비밀번호
     * @return 업데이트된 행 수
     */
    int updatePassword(
        @Param("memberId") Long memberId, 
        @Param("passwordHash") String passwordHash
    );
    
}
