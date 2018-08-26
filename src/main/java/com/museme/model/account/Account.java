package com.museme.model.account;

import com.museme.model.Project;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "user_name", unique = true)
    @NotEmpty(message = "*Please provide a user name")
    private String username;

    @Column(name = "email", unique = true)
    @Email(message = "*Please provide a valid email")
    @NotEmpty(message = "*Please provide an email")
    private String email;

    @Column(name = "password", unique = true)
    @Length(min = 5, message = "*Your password must have at least 5 characters")
    @NotEmpty(message = "*Please provide your password")
    private String password;

    @Transient
    private String confirmPassword;

    @ManyToMany
    @JoinTable(name = "account_role",
            joinColumns = @JoinColumn(name = "account.id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Column(name = "active")
    private boolean active;

    @Column(name = "member_since")
    private LocalDateTime memberSince;

    @OneToMany(mappedBy = "owner")
    private List<Project> projectsOwned;

    @ManyToMany(mappedBy = "contributors")
    @OrderColumn
    private Set<Project> projectsContributed;

    public Account() {
    }

    public Account(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void addRole(Role role) {
        this.roles.add(role);
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getMemberSince() {
        return memberSince;
    }

    public void setMemberSince(LocalDateTime memberSince) {
        this.memberSince = memberSince;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public List<Project> getProjectsOwned() {
        return projectsOwned;
    }

    public void setProjectsOwned(List<Project> projectsOwned) {
        this.projectsOwned = projectsOwned;
    }

    public Set<Project> getProjectsContributed() {
        return projectsContributed;
    }

    public void setProjectsContributed(Set<Project> projectsContributed) {
        this.projectsContributed = projectsContributed;
    }

    @Override
    public String toString() {
        return "Account{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
