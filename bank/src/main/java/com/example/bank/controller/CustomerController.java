package com.example.bank.controller;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.example.bank.dto.CustomerResponseDTO;
import com.example.bank.model.Customer;
import com.example.bank.repository.CustomerRepository;
import com.example.bank.service.CustomerService;
import com.example.bank.service.PDFGenerationService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PDFGenerationService pdfGenerationService;

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
    
    @GetMapping("/{customerId}/statement")
    public ResponseEntity<byte[]> downloadCustomerStatement(@PathVariable Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        byte[] pdfContent = pdfGenerationService.generateCustomerStatement(customer);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + customerId + "_statement.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    
}
