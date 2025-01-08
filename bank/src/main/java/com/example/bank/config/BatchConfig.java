package com.example.bank.config;
import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
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
import java.time.LocalDateTime;

@Configuration
@EnableBatchProcessing
@EnableScheduling
public class BatchConfig {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Bean
    public Job interestCalculationJob() {
        return new JobBuilder("interestCalculationJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .flow(interestCalculationStep())
                .end()
                .build();
    }

    @Bean
    public Step interestCalculationStep() {
        return new StepBuilder("interestCalculationStep", jobRepository)
                .<Account, Transaction>chunk(10, transactionManager)
                .reader(accountItemReader())
                .processor(accountItemProcessor())
                .writer(transactionItemWriter())
                .build();
    }

    @Bean
    public JpaPagingItemReader<Account> accountItemReader() {
        return new JpaPagingItemReaderBuilder<Account>()
                .name("accountItemReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("SELECT a FROM Account a")
                .pageSize(10)
                .build();
    }

    @Bean
    public ItemProcessor<Account, Transaction> accountItemProcessor() {
        return account -> {
            double interest = account.getClosingBalance() * 0.01; // 1% interest rate
            account.setClosingBalance(account.getClosingBalance() + interest);
            accountRepository.save(account);

            Transaction transaction = new Transaction();
            transaction.setAccount(account);
            transaction.setAmount(interest);
            transaction.setType("INTEREST");
            transaction.setInitiatedBy("SPRING BATCH");
            transaction.setInitiatedDate(LocalDateTime.now());
            transaction.setStatus("APPROVED");
            transaction.setAuthorizedBy("AUTO");
            transaction.setAuthorizationDate(LocalDateTime.now());
            return transaction;
        };
    }

    @Bean
    public ItemWriter<Transaction> transactionItemWriter() {
        return transactions -> transactionRepository.saveAll(transactions);
    }

    @Scheduled(cron = "0 55 8 * * ?", zone = "Asia/Kolkata")
    public void perform() throws Exception {
        jobLauncher.run(interestCalculationJob(), new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters());
    }
}
