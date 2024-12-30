package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.Customer;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionService transactionService; // Inject TransactionService
    private final CustomerRepository customerRepository;

    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerCustomerId(customerId);
    }

    public Account createAccount(Account account) {
        // Load the customer entity from the database
        Optional<Customer> customerOpt = customerRepository.findById(account.getCustomer().getCustomerId());
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            account.setCustomer(customer);  // Set the full customer object with all details
        } else {
            throw new RuntimeException("Customer not found with ID: " + account.getCustomer().getCustomerId());
        }

        // Initialize opening and closing balance
        account.setClosingBalance(account.getOpeningBalance());
        Account createdAccount = accountRepository.save(account);

        // Create a transaction for the opening balance
        Transaction transaction = new Transaction();
        transaction.setAccount(createdAccount);
        transaction.setAmount(createdAccount.getOpeningBalance());
        transaction.setType("DEPOSIT");
        transactionService.createTransaction(transaction, false); // Skip balance adjustment

        return createdAccount;
    }

    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public Optional<Account> getAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }
    public Optional<Account> getAccountByCustomerIdAndAccountNumber(Long customerId, String accountNumber) {
        return accountRepository.findByCustomerCustomerIdAndAccountNumber(customerId, accountNumber);
    }

}
