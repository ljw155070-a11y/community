package kr.co.community.main.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias (value ="post")
public class PostVo {
	private int postId;
	private	String title;
	private String nickname;
	private int viewCount;
	private int likeCount;
	private int commentCount;
	private Date createdAt;
}
