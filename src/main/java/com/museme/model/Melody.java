package com.museme.model;

import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Component
public class Melody implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "melody")
    private List<KeyEvent> melody;

    @Column(unique = true)
    private String name;

    private Integer bpm;

    @ManyToOne(cascade = {CascadeType.ALL})
    private Project project;

    public Melody() {
    }

    public Melody(Integer bpm) {
        melody = new ArrayList<>();
        this.bpm = bpm;
    }

    public void addKey(KeyEvent keyEvent) {
        melody.add(keyEvent);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<KeyEvent> getMelody() {
        return melody;
    }

    public void setMelody(List<KeyEvent> melody) {
        this.melody = melody;
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public String toString() {
        return "Melody{" +
                "melody=" + melody +
                '}';
    }
}
