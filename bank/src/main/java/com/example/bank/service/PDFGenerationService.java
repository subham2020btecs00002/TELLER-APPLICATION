package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.Customer;
import com.example.bank.model.Transaction;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

@Service
public class PDFGenerationService {

    public byte[] generateCustomerStatement(Customer customer) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDoc = new PdfDocument(writer);
             Document document = new Document(pdfDoc, PageSize.A4)) {

            // Add title
            Paragraph title = new Paragraph("E-Statement")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER);
            document.add(title);

            // Add customer details
            document.add(new Paragraph("Customer Name: " + customer.getName()));
            document.add(new Paragraph("Customer Email: " + customer.getEmail()));

            // Add account details and transactions
            for (Account account : customer.getAccounts()) {
                document.add(new Paragraph("Account Number: " + account.getAccountNumber()).setBold());
                document.add(new Paragraph("Opening Balance: " + account.getOpeningBalance()).setBold());
                document.add(new Paragraph("Closing Balance: " + account.getClosingBalance()).setBold());

                if (!account.getTransactions().isEmpty()) {
                    Table table = new Table(UnitValue.createPercentArray(new float[]{10, 20, 20, 20, 30}))
                            .useAllAvailableWidth();
                    table.addHeaderCell("ID");
                    table.addHeaderCell("Amount");
                    table.addHeaderCell("Type");
                    table.addHeaderCell("Status");
                    table.addHeaderCell("Date");

                    for (Transaction transaction : account.getTransactions()) {
                        table.addCell(transaction.getTransactionId().toString());
                        table.addCell(String.valueOf(transaction.getAmount()));
                        table.addCell(transaction.getType());
                        table.addCell(transaction.getStatus());
                        table.addCell(transaction.getInitiatedDate().toString());
                    }
                    document.add(table);

                    // Add space after the table
                    document.add(new Paragraph("\n"));
                }
            }

            // Footer
            document.add(new Paragraph("Generated on: " + LocalDateTime.now()));
            document.close();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
