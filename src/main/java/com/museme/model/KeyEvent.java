package com.museme.model;

public class KeyEvent {

    private String key;
    private Double startTime;
    private Double stopTime;
    private String note;
    private String octave;

    public KeyEvent(String key, Double startTime) {
        this.key = key;
        this.startTime = startTime;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public double getStartTime() {
        return startTime;
    }

    public void setStartTime(Double startTime) {
        this.startTime = startTime;
    }

    public Double getStopTime() {
        return stopTime;
    }

    public void setStopTime(Double stopTime) {
        this.stopTime = stopTime;
    }

    @Override
    public String toString() {
        return "Key: " + key +
                ", startTime: " + startTime +
                ", stopTime: " + stopTime;
    }
}
