package dev.synapsetech.tzdb.plugins

import dev.synapsetech.tzdb.config.MainConfig
import dev.synapsetech.tzdb.routes.userRoutes
import dev.synapsetech.tzdb.util.toApiJson
import io.ktor.server.application.*
import io.ktor.server.locations.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.ZoneId

@OptIn(KtorExperimentalLocationsAPI::class)
fun Application.configureRouting() {
    install(Locations) {}

    routing {
        get("/") {
            call.respondRedirect(MainConfig.instance.webUrl)
        }

        route("/v1") {
            get("/zones") {
                val zones = ZoneId.getAvailableZoneIds().toList().sorted().map { ZoneId.of(it) }
                call.respond(zones.map(ZoneId::toApiJson))
            }

            userRoutes()
        }
    }
}

