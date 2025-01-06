package com.example.bank.controller;
import com.example.bank.dto.TransactionDTO;
import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
import com.example.bank.service.TransactionService;
import com.example.bank.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final JwtUtil jwtUtil; // Util to extract email and role from JWT token

 // Fetch all pending transactions
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ROLE_AUTHORIZER')")
    public ResponseEntity<List<TransactionDTO>> getPendingTransactions() {
        List<Transaction> pendingTransactions = transactionRepository.findByStatus("PENDING");
        List<TransactionDTO> transactionDTOs = pendingTransactions.stream()
                .map(transaction -> new TransactionDTO(
                        transaction.getTransactionId(),
                        transaction.getAmount(),
                        transaction.getType(),
                        transaction.getAccount().getAccountId(),
                        transaction.getStatus() // Include status here
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDTOs);
    }

    // Approve/Reject a transaction
    @PutMapping("/{transactionId}/approve")
    @PreAuthorize("hasAuthority('ROLE_AUTHORIZER')")
    public ResponseEntity<String> approveTransaction(
            @PathVariable Long transactionId,
            @RequestParam boolean approve,
            @RequestHeader("Authorization") String token) {
        transactionService.approveTransaction(transactionId, approve, token.replace("Bearer ", ""));
        return ResponseEntity.ok(approve ? "Transaction approved" : "Transaction rejected");
    }
    @PostMapping
    public ResponseEntity<Object> createTransaction(@RequestBody Transaction transaction, @RequestHeader("Authorization") String token) {
        // Fetch the latest Account from the database
    	
        System.out.println("Received token: " + token);

        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));

        System.out.println("Received EMAIL: " + email);

        
        Account account = accountRepository.findById(transaction.getAccount().getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Use the fetched account to ensure closingBalance is accurate
        double closingBalance = account.getClosingBalance();
        System.out.print(closingBalance);
        if ("WITHDRAWAL".equalsIgnoreCase(transaction.getType())) {
            
            // Check for sufficient balance
            System.out.println(closingBalance);
            System.out.println(transaction.getAmount());

            if (closingBalance < transaction.getAmount()) {
                return ResponseEntity.badRequest().body("Insufficient balance for this withdrawal.");
            }
        }


        Transaction createdTransaction = transactionService.createTransaction(transaction,true,token.replace("Bearer ", ""));
        TransactionDTO transactionDTO = new TransactionDTO(
                createdTransaction.getTransactionId(),
                createdTransaction.getAmount(),
                createdTransaction.getType(),
                createdTransaction.getAccount().getAccountId(),
                createdTransaction.getStatus()
        );
        return ResponseEntity.ok(transactionDTO);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByAccountId(@PathVariable Long accountId) {
        List<Transaction> transactions = transactionService.getTransactionsByAccountId(accountId);
        List<TransactionDTO> transactionDTOs = transactions.stream()
                .map(transaction -> new TransactionDTO(
                        transaction.getTransactionId(),
                        transaction.getAmount(),
                        transaction.getType(),
                        transaction.getAccount().getAccountId(),
                        transaction.getStatus()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDTOs);
    }
}
