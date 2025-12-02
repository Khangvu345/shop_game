package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employee")
@PrimaryKeyJoinColumn(name = "party_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends Party {

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "status", length = 30)
    private String status;
}
