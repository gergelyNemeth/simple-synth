package com.museme.model;

import com.museme.model.account.Account;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.List;

@Entity
@Component
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "project")
    private List<Melody> melodyList;

    @Column(unique = true)
    private String name;

    private Integer tempo;

    @ManyToOne
    private Account owner;

    @ManyToMany
    private List<Account> contributors;

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

    public Integer getTempo() {
        return tempo;
    }

    public void setTempo(Integer tempo) {
        this.tempo = tempo;
    }

    public Account getOwner() {
        return owner;
    }

    public void setOwner(Account owner) {
        this.owner = owner;
    }

    public List<Account> getContributors() {
        return contributors;
    }

    public void addContributor(Account contributor) {
        contributors.add(contributor);
    }

    public void deleteContributor(Account contributor) {
        contributors.remove(contributor);
    }
}
