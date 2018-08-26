package com.museme.model;

import com.museme.model.account.Account;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Component
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "project", cascade = {CascadeType.ALL})
    private List<Melody> melodyList = new ArrayList<>();

    @Column(unique = true)
    private String name;

    private Integer bpm;

    @ManyToOne
    private Account owner;

    @ManyToMany
    @OrderColumn
    @JoinTable(name = "project_contributor",
            joinColumns = {@JoinColumn(name = "project_id")},
            inverseJoinColumns = {@JoinColumn(name = "account_id")}
    )
    private Set<Account> contributors = new HashSet<>();

    public Project() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<Melody> getMelodyList() {
        return melodyList;
    }

    public void setMelodyList(List<Melody> melodyList) {
        this.melodyList = melodyList;
    }

    public void addMelody(Melody melody) {
        melodyList.add(melody);
    }

    public void deleteMelody(Melody melody) {
        melodyList.remove(melody);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getBpm() {
        return bpm;
    }

    public void setBpm(Integer bpm) {
        this.bpm = bpm;
    }

    public Account getOwner() {
        return owner;
    }

    public void setOwner(Account owner) {
        this.owner = owner;
    }

    public Set<Account> getContributors() {
        return contributors;
    }

    public void addContributor(Account contributor) {
        contributors.add(contributor);
    }

    public void deleteContributor(Account contributor) {
        contributors.remove(contributor);
    }
}
