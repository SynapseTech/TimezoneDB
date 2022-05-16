package dev.synapsetech.tzdb.plugins

import dev.synapsetech.tzdb.data.User
import io.ktor.server.application.*
import io.ktor.server.locations.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@OptIn(KtorExperimentalLocationsAPI::class)
fun Application.configureRouting() {
    install(Locations) {}

    routing {
        get("/") {
            val sess = call.sessions.get<UserSession>()
            if (sess?.userId != null) {
                val user = User.findById(sess.userId)
                if (user != null) call.respond(user)
                else call.respond(mapOf<String, Any>())
            } else call.respond(mapOf<String, Any>())
        }

        get("/v1/zones") {
            val zones = ZoneId.getAvailableZoneIds().toList().sorted().map { ZoneId.of(it) }
            val dt = LocalDateTime.now()
            val offsetFormatter = DateTimeFormatter.ofPattern("xxx")


            call.respond(zones.map {
                val zdt = dt.atZone(it)
                mapOf(
                    "id" to it.id,
                    "offset" to offsetFormatter.format(zdt.offset),
                )
            })
        }

        get<UserRoute> {
            call.respondText("Location: name=${it.name}, arg1=${it.arg1}, arg2=${it.arg2}")
        }
        // Register nested routes
        get<Type.Edit> {
            call.respondText("Inside $it")
        }
        get<Type.List> {
            call.respondText("Inside $it")
        }
    }
}

@OptIn(KtorExperimentalLocationsAPI::class)
@Location("/location/{name}")
class UserRoute(val name: String, val arg1: Int = 42, val arg2: String = "default")

@OptIn(KtorExperimentalLocationsAPI::class)
@Location("/type/{name}")
data class Type(val name: String) {
    @Location("/edit")
    data class Edit(val type: Type)

    @Location("/list/{page}")
    data class List(val type: Type, val page: Int)
}
