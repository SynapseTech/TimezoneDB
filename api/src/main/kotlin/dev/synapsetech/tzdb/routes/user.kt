package dev.synapsetech.tzdb.routes

import dev.synapsetech.tzdb.data.User
import dev.synapsetech.tzdb.data.getUser
import dev.synapsetech.tzdb.util.toApiJson
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.ZoneId

fun Route.userRoutes() {
    authenticate("auth-jwt") {
        route("/users/@me") {
            get {
                val user = getUser()
                if (user != null) call.respond(user)
                else call.respond(HttpStatusCode.NotFound)
            }

            patch {
                // @todo
            }

            delete {
                // @todo
            }
        }
    }

    get("/users/{id}/timezoneInfo") {
        val userId = call.parameters["id"]?.toLong()
        if (userId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        val user = User.findById(userId)
        if (user != null) call.respond(ZoneId.of(user.zoneId).toApiJson())
        else call.respond(HttpStatusCode.NotFound)
    }
}
