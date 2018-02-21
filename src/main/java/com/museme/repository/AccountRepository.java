package com.museme.repository;

import com.museme.model.account.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Account findByEmail(String email);
    Account findByUsername(String username);
}
