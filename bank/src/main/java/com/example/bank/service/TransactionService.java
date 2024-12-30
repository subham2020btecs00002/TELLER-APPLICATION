package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Transaction createTransaction(Transaction transaction, boolean adjustBalance) {
        Account account = accountRepository.findById(transaction.getAccount().getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if ("WITHDRAWAL".equalsIgnoreCase(transaction.getType()) && transaction.getAmount() > 1000) {
            transaction.setStatus("PENDING");
            return transactionRepository.save(transaction); // Save as pending
        }

        // Process smaller withdrawals and deposits
        if (adjustBalance) {
            if ("DEPOSIT".equalsIgnoreCase(transaction.getType())) {
                account.setClosingBalance(account.getClosingBalance() + transaction.getAmount());
            } else if ("WITHDRAWAL".equalsIgnoreCase(transaction.getType())) {
                if (account.getClosingBalance() < transaction.getAmount()) {
                    throw new RuntimeException("Insufficient balance");
                }
                account.setClosingBalance(account.getClosingBalance() - transaction.getAmount());
            } else {
                throw new RuntimeException("Invalid transaction type");
            }
            accountRepository.save(account);
        }

        transaction.setStatus("APPROVED");
        return transactionRepository.save(transaction); // Save as approved
    }
    @Transactional
    public Transaction approveTransaction(Long transactionId, boolean approve) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!"PENDING".equalsIgnoreCase(transaction.getStatus())) {
            throw new RuntimeException("Transaction is not pending approval");
        }

        if (approve) {
            transaction.setStatus("APPROVED");

            // Adjust the account balance
            Account account = transaction.getAccount();
            if ("WITHDRAWAL".equalsIgnoreCase(transaction.getType())) {
                if (account.getClosingBalance() < transaction.getAmount()) {
                    throw new RuntimeException("Insufficient balance");
                }
                account.setClosingBalance(account.getClosingBalance() - transaction.getAmount());
            }
            accountRepository.save(account);
        } else {
            transaction.setStatus("REJECTED");
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountAccountId(accountId);
    }
}
