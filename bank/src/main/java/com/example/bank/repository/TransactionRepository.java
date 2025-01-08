package com.example.bank.repository;

import com.example.bank.model.Customer;
import com.example.bank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountAccountId(Long accountId);
    List<Transaction> findByStatus(String status);
    List<Transaction> findByAccountCustomer(Customer customer);

}

