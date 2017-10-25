package model;

public class StartEvent {

    private String key;
    private double startTime;

    public StartEvent(String key, double startTime) {
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

    public void setStartTime(double startTime) {
        this.startTime = startTime;
    }

    @Override
    public String toString() {
        return "Key: " + key +
                ", startTime: " + startTime;
    }
}
