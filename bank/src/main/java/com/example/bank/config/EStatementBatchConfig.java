package com.example.bank.config;

import com.example.bank.model.Account;
import com.example.bank.model.Customer;
import com.example.bank.model.Transaction;
import com.example.bank.repository.CustomerRepository;
import com.itextpdf.forms.PdfAcroForm;
import com.itextpdf.forms.fields.PdfFormField;
import com.itextpdf.kernel.*;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.*;
import com.itextpdf.*;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.PlatformTransactionManager;
import jakarta.persistence.EntityManagerFactory;

import java.io.FileOutputStream;
import java.time.LocalDateTime;

@Configuration
@EnableBatchProcessing
@EnableScheduling
public class EStatementBatchConfig {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Bean
    public Job eStatementJob() {
        return new JobBuilder("eStatementJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .flow(eStatementStep())
                .end()
                .build();
    }

    @Bean
    public Step eStatementStep() {
        return new StepBuilder("eStatementStep", jobRepository)
                .<Customer, Customer>chunk(10, transactionManager)
                .reader(customerItemReader())
                .processor(customerItemProcessor())
                .writer(customerItemWriter())
                .build();
    }

    @Bean
    public JpaPagingItemReader<Customer> customerItemReader() {
        return new JpaPagingItemReaderBuilder<Customer>()
                .name("customerItemReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("SELECT c FROM Customer c")
                .pageSize(10)
                .build();
    }

@Bean
public ItemProcessor<Customer, Customer> customerItemProcessor() {
    return customer -> {
        // Generate PDF e-statement for the customer
        String directoryPath = "estatements";
        String pdfFilePath = directoryPath + "/" + customer.getCustomerId() + "_statement.pdf";

        // Create the directory if it doesn't exist
        java.io.File directory = new java.io.File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try (PdfWriter writer = new PdfWriter(new FileOutputStream(pdfFilePath));
             PdfDocument pdfDoc = new PdfDocument(writer);
             Document document = new Document(pdfDoc, PageSize.A4)) {

            // Add title
            Paragraph title = new Paragraph("E-Statement")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            // Add customer details
            document.add(new Paragraph("Customer Name: " + customer.getName())
                    .setFontSize(12)
                    .setMarginTop(20));
            document.add(new Paragraph("Customer Email: " + customer.getEmail())
                    .setFontSize(12));

            // Add account details and transactions for each account
            for (Account account : customer.getAccounts()) {
                document.add(new Paragraph("Account Number: " + account.getAccountNumber())
                        .setFontSize(12)
                        .setMarginTop(10)
                        .setBold());
                document.add(new Paragraph("Opening Balance: " + account.getOpeningBalance())
                        .setFontSize(12)
                        .setBold());
                document.add(new Paragraph("Closing Balance: " + account.getClosingBalance())
                        .setFontSize(12)
                        .setBold());

                // Add transactions table
                if (!account.getTransactions().isEmpty()) {
                    Table table = new Table(UnitValue.createPercentArray(new float[]{10, 20, 20, 20, 30}))
                            .useAllAvailableWidth()
                            .setMarginTop(20);

                    // Add table header
                    table.addHeaderCell(new Cell().add(new Paragraph("ID").setBold()));
                    table.addHeaderCell(new Cell().add(new Paragraph("Amount").setBold()));
                    table.addHeaderCell(new Cell().add(new Paragraph("Type").setBold()));
                    table.addHeaderCell(new Cell().add(new Paragraph("Status").setBold()));
                    table.addHeaderCell(new Cell().add(new Paragraph("Date").setBold()));

                    // Add table rows
                    for (Transaction transaction : account.getTransactions()) {
                        table.addCell(new Cell().add(new Paragraph(transaction.getTransactionId().toString())));
                        table.addCell(new Cell().add(new Paragraph(String.valueOf(transaction.getAmount()))));
                        table.addCell(new Cell().add(new Paragraph(transaction.getType())));
                        table.addCell(new Cell().add(new Paragraph(transaction.getStatus())));
                        table.addCell(new Cell().add(new Paragraph(transaction.getInitiatedDate().toString())));
                    }

                    document.add(table);

                    // Add vertical gap after each table
                    document.add(new Paragraph("\n").setMarginTop(20));
                }
            }

            // Add footer
            Paragraph footer = new Paragraph("Generated on: " + LocalDateTime.now())
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(20);
            document.add(footer);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return customer;
    };
}

    @Bean
    public ItemWriter<Customer> customerItemWriter() {
        return customers -> {
            // You can add any additional logic here if needed
        };
    }

    @Scheduled(cron = "0 0 0 * * ?") // Run on the first day of every month at midnight
    public void perform() throws Exception {
        jobLauncher.run(eStatementJob(), new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters());
    }
}