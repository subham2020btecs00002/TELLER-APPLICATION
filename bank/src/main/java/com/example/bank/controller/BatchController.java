package com.example.bank.controller;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/batch")
public class BatchController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job interestCalculationJob;

    @Autowired
    private Job eStatementJob;

    @PostMapping("/trigger-interest-calculation")
    public ResponseEntity<String> triggerInterestCalculation() {
        try {
            jobLauncher.run(
                    interestCalculationJob,
                    new JobParametersBuilder()
                            .addLong("timestamp", System.currentTimeMillis()) // Add a unique parameter to ensure a new job instance
                            .toJobParameters()
            );
            return ResponseEntity.ok("Interest Calculation Batch Job triggered successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error triggering Batch Job: " + e.getMessage());
        }
    }

    @PostMapping("/trigger-e-statement")
    public ResponseEntity<String> triggerEStatement() {
        try {
            jobLauncher.run(
                    eStatementJob,
                    new JobParametersBuilder()
                            .addLong("timestamp", System.currentTimeMillis()) // Add a unique parameter to ensure a new job instance
                            .toJobParameters()
            );
            return ResponseEntity.ok("E-Statement Batch Job triggered successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error triggering Batch Job: " + e.getMessage());
        }
    }
}