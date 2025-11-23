package br.com.criptomanager.resource;

import br.com.criptomanager.service.robot.RobotManager;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/api/robots")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RobotResource {

    @Inject
    RobotManager robotManager;

    @GET
    public Response getRobots() {
        return Response.ok(robotManager.getRobotsStatus()).build();
    }

    @POST
    @Path("/{name}/start")
    public Response startRobot(@PathParam("name") String name) {
        robotManager.start(name);
        return Response.ok().build();
    }

    @POST
    @Path("/{name}/stop")
    public Response stopRobot(@PathParam("name") String name) {
        robotManager.stop(name);
        return Response.ok().build();
    }

    @PUT
    @Path("/{name}/frequency")
    public Response setFrequency(@PathParam("name") String name, Map<String, Long> body) {
        if (body.containsKey("frequency")) {
            robotManager.setFrequency(name, body.get("frequency"));
            return Response.ok().build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }
}
