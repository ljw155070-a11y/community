package kr.co.community.backend.settings.dto;

import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Alias(value = "settings")
@Data
public class SettingsDTO {
    private Long memberId;
    private String name;
    private String email;
    private String bio;
}