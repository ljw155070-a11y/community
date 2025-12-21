package kr.co.community.backend.settings.dto;

import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Alias(value = "passwordChange")
@Data
public class PasswordChangeDTO {
    private String currentPassword;
    private String newPassword;
}