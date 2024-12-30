package com.example.bank.dto;

import java.util.List;
import com.example.bank.model.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {
    private Long customerId;
    private String name;
    private String email;
    private String phoneNumber;  
    private String gender;  
    private String address; 
    private List<Account> accounts;
}
