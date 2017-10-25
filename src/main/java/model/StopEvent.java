package model;

public class StopEvent {

    private String key;
    private double stopTime;

    public StopEvent(String key, double stopTime) {
        this.key = key;
        this.stopTime = stopTime;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public double getStopTime() {
        return stopTime;
    }

    public void setStopTime(double stopTime) {
        this.stopTime = stopTime;
    }

    @Override
    public String toString() {
        return "Key: " + key +
                ", stopTime: " + stopTime;
    }
}
