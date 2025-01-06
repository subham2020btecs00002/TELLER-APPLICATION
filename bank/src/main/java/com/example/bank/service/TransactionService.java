package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
import com.example.bank.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final JwtUtil jwtUtil; // Util to extract email and role from JWT token

    @Transactional
    public Transaction createTransaction(Transaction transaction, boolean adjustBalance, String token) {
        Account account = accountRepository.findById(transaction.getAccount().getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        String email = jwtUtil.extractEmail(token); // Extract email from the token

        

        transaction.setInitiatedBy(email); // Set the initiatedBy field
        transaction.setInitiatedDate(LocalDateTime.now()); // Set the initiatedDate to the current time

        if ("WITHDRAWAL".equalsIgnoreCase(transaction.getType()) && transaction.getAmount() > 1000) {
            transaction.setStatus("PENDING");
            transaction.setAuthorizedBy(null); // No authorizer yet
            transaction.setAuthorizationDate(null); // No authorization date yet
            return transactionRepository.save(transaction);
        }

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
        transaction.setAuthorizedBy("AUTO");
        transaction.setAuthorizationDate(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction approveTransaction(Long transactionId, boolean approve, String token) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!"PENDING".equalsIgnoreCase(transaction.getStatus())) {
            throw new RuntimeException("Transaction is not pending approval");
        }

        String email = jwtUtil.extractEmail(token);

        if (approve) {
            transaction.setStatus("APPROVED");
            transaction.setAuthorizedBy(email);
            transaction.setAuthorizationDate(LocalDateTime.now());

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
            transaction.setAuthorizedBy(email);
            transaction.setAuthorizationDate(LocalDateTime.now());
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountAccountId(accountId);
    }
}
