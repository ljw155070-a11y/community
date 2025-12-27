package kr.co.community.backend.post.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FollowDTO {
    private Long followId;
    private Long followerId;      // 팔로우 하는 사람
    private Long followingId;     // 팔로우 당하는 사람
    private String followerName;
    private String followerNickname;
    private String followerProfileImage;
    private String followingName;
    private String followingNickname;
    private String followingProfileImage;
    private LocalDateTime createdAt;
}
