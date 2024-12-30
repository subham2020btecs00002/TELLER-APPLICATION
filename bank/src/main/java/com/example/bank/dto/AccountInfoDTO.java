package com.example.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccountInfoDTO {
    private Long accountId;
    private Long customerId;
    private String customerName;  
    private String customerEmail; 
    private String customerPhoneNumber; 
    private String customerGender; 
    private String customerAddress;
    private double openingBalance;
    private double closingBalance;
    private String accountNumber;
}
