package com.example.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.List;


@Data
@NoArgsConstructor
@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id") 
    private Long accountId;

    @Column(nullable = false, name = "opening_balance") 
    private double openingBalance;

    @JsonIgnore
    @Column(nullable = false, name = "closing_balance") 
    private double closingBalance;

    @Column(nullable = false, unique = true, name = "account_number") 
    private String accountNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false) 
    private Customer customer;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;
}
