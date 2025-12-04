package com.gameshop.model.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.gameshop.model.enums.PeriodType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a time period for dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PeriodDto {

    /**
     * Type of period (MONTH, QUARTER, YEAR)
     */
    private PeriodType type;

    /**
     * Month (1-12), applicable for MONTH type
     */
    private Integer month;

    /**
     * Year (e.g., 2025)
     */
    private Integer year;

    /**
     * Quarter (1-4), applicable for QUARTER type
     */
    private Integer quarter;
}
