package com.example.bank.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id") 
    private Long transactionId;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String type; 
    

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false) 
    private Account account;
    
    @JsonIgnore
    @Column(nullable = false)
    private String status; 

    @Column(nullable = false) // Make it non-null for initiated by
    private String initiatedBy;

    @Column(nullable = false) // Make it non-null for initiated date
    private LocalDateTime initiatedDate; 

    
    @Column(nullable = true) // Allow null for pending transactions
    private String authorizedBy;

    @Column(nullable = true)
    private LocalDateTime authorizationDate; // Same for authorizationDate

}
