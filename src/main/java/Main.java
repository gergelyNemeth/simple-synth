import controller.SaveEventController;
import controller.SynthPageController;

import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

public class Main {


    public static void main(String[] args) {
        exception(Exception.class, (e, req, res) -> e.printStackTrace());
        staticFileLocation("/public");
        port(8888);

        get("/", SynthPageController.getInstance()::render);
        post("/saveStart", SaveEventController.getInstance()::saveStart);
        put("/saveStop", SaveEventController.getInstance()::saveStop);
        delete("/", SaveEventController.getInstance()::clearAll);

        enableDebugScreen();
    }
}
