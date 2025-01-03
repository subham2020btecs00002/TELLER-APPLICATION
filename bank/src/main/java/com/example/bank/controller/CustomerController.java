package com.example.bank.controller;

import com.example.bank.dto.CustomerResponseDTO;
import com.example.bank.model.Customer;
import com.example.bank.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(@RequestBody Customer customer) {
        Customer createdCustomer = customerService.createCustomer(customer);
        CustomerResponseDTO responseDTO = mapToResponseDTO(createdCustomer);
        return ResponseEntity.ok(responseDTO);
    }

    private CustomerResponseDTO mapToResponseDTO(Customer customer) {
        return new CustomerResponseDTO(
            customer.getCustomerId(),
            customer.getName(),
            customer.getEmail(),
            customer.getPhoneNumber(),  
            customer.getGender(),  
            customer.getAddress(),  
            customer.getAccounts()
        );
    }
}
