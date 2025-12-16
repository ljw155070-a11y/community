package kr.co.community.main.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias (value="notice")
public class NoticeVo {
	private int noticeId;          
	private String noticeType;     
	private String title;          
	private Date createdAt;   
}
