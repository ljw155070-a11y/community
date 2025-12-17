package kr.co.community.backend.category.dto;

import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("boardCategory")
public class BoardCategoryDTO {
    private Integer categoryId;   // CATEGORY_ID
    private String categoryName;  // CATEGORY_NAME
    private Integer sortOrder;    // SORT_ORDER
    private String isActive;      // IS_ACTIVE (Y/N)
}
