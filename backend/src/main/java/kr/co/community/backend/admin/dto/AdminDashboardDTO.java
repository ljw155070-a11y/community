package kr.co.community.backend.admin.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class AdminDashboardDTO {
    private int totalMembers;
    private int totalPosts;
    private int totalComments;
    private int pendingReports;

    // [{type:"회원가입", text:"새로운 회원 가입: 김철수", minutesAgo:5}, ...] 느낌으로 내려도 됨
    private List<Map<String, Object>> recentActivities;
}
