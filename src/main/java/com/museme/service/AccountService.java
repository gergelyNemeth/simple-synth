package com.museme.service;

import com.museme.model.account.Account;

public interface AccountService {

    void saveUser(Account account);

    Account findUserByEmail(String email);

    Account findUserByName(String username);
}
