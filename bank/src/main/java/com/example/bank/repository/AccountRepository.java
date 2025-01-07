package com.example.bank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bank.model.Account;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByCustomerCustomerId(Long customerId);
    Optional<Account> findByAccountNumber(String accountNumber);
    Optional<Account> findByCustomerCustomerIdAndAccountNumber(Long customerId, String accountNumber);
    List<Account> findAll(); // Ensure this method is present

}
