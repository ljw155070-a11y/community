package kr.co.community.backend.admin.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AdminReportDTO {
    private Long reportId;

    private String targetType;  // POST / COMMENT
    private Long targetId;

    private String reporterName;
    private String reason;
    private String status;      // PENDING / DONE / REJECTED
    private LocalDateTime createdAt;
}
