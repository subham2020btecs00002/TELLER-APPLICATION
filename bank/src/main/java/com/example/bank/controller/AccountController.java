package com.example.bank.controller;

import com.example.bank.dto.AccountInfoDTO;
import com.example.bank.model.Account;
import com.example.bank.model.Customer;
import com.example.bank.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountInfoDTO> createAccount(@RequestBody Account account,@RequestHeader("Authorization") String token) {
        // Create the account and save it
        Account createdAccount = accountService.createAccount(account,token.replace("Bearer ", ""));

        // Map the created Account to AccountInfoDTO
        Customer customer = createdAccount.getCustomer();  // Get the associated customer
        AccountInfoDTO accountInfoDTO = new AccountInfoDTO(
                createdAccount.getAccountId(),
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getGender(),
                customer.getAddress(),
                createdAccount.getOpeningBalance(),
                createdAccount.getClosingBalance(),
                createdAccount.getAccountNumber()
        );

        // Return the AccountInfoDTO as the response
        return ResponseEntity.ok(accountInfoDTO);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<AccountInfoDTO>> getAccountsByCustomerId(@PathVariable Long customerId) {
        List<Account> accounts = accountService.getAccountsByCustomerId(customerId);
        List<AccountInfoDTO> accountInfoDTOs = accounts.stream()
                .map(account -> {
                    Customer customer = account.getCustomer();  // Get the associated customer
                    return new AccountInfoDTO(
                            account.getAccountId(),
                            customer.getCustomerId(),
                            customer.getName(),
                            customer.getEmail(),
                            customer.getPhoneNumber(),
                            customer.getGender(),
                            customer.getAddress(),
                            account.getOpeningBalance(),
                            account.getClosingBalance(),
                            account.getAccountNumber()
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(accountInfoDTOs);
    }
    
    @GetMapping("/{customerId}/account/{accountNumber}/balances")
    public ResponseEntity<Object> getAccountBalances(@PathVariable Long customerId, @PathVariable String accountNumber) {
        Optional<Account> accountOpt = accountService.getAccountByCustomerIdAndAccountNumber(customerId, accountNumber);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            return ResponseEntity.ok(Map.of(
                    "openingBalance", account.getOpeningBalance(),
                    "closingBalance", account.getClosingBalance()
            ));
        } else {
            return ResponseEntity.status(404).body("Account not found for the provided customer ID and account number");
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountInfoDTO> getAccountById(@PathVariable Long accountId) {
        Account account = accountService.getAccountById(accountId);
        Customer customer = account.getCustomer();  // Get the associated customer
        AccountInfoDTO accountInfoDTO = new AccountInfoDTO(
                account.getAccountId(),
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getGender(),
                customer.getAddress(),
                account.getOpeningBalance(),
                account.getClosingBalance(),
                account.getAccountNumber());
        return ResponseEntity.ok(accountInfoDTO);
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<Object> getAccountInfoByAccountNumber(@PathVariable String accountNumber) {
        Optional<Account> accountOpt = accountService.getAccountByAccountNumber(accountNumber);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            Customer customer = account.getCustomer();  // Get the associated customer
            AccountInfoDTO accountInfoDTO = new AccountInfoDTO(
                    account.getAccountId(),
                    customer.getCustomerId(),
                    customer.getName(),
                    customer.getEmail(),
                    customer.getPhoneNumber(),
                    customer.getGender(),
                    customer.getAddress(),
                    account.getOpeningBalance(),
                    account.getClosingBalance(),
                    account.getAccountNumber());
            return ResponseEntity.ok(accountInfoDTO);
        } else {
            return ResponseEntity.status(404).body("Account not found");
        }
    }
}
