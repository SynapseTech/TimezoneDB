package dev.synapsetech.tzdb.routes

import dev.synapsetech.tzdb.data.User
import dev.synapsetech.tzdb.data.getUser
import dev.synapsetech.tzdb.util.toApiJson
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.ZoneId

fun Route.userRoutes() {
    route("/users/") {
        authenticate("auth-jwt") {
            route("@me") {
                get {
                    val user = getUser()
                    if (user != null) call.respond(user.toApiJson())
                    else call.respond(HttpStatusCode.NotFound)
                }

                patch {
                    val patch = call.receive<User.Patch>()
                    val user = getUser()

                    if (user != null) {
                        patch.zoneId?.let {
                            user.zoneId = it
                        }

                        user.save()
                        call.respond(HttpStatusCode.OK)
                    } else call.respond(HttpStatusCode.NotFound)
                }

                delete {
                    val user = getUser()
                    if (user != null) {
                        user.delete()
                        call.respond(HttpStatusCode.OK)
                    } else call.respond(HttpStatusCode.NotFound)
                }
            }
        }

        get("/{id}") {
            val userId = call.parameters["id"]?.toLong() ?: run {
                call.respond(HttpStatusCode.BadRequest)
                return@get
            }

            val user = User.findById(userId)
            if (user != null) call.respond(user.toApiJson())
            else call.respond(HttpStatusCode.NotFound)
        }

        route("/byPlatform") {
            get("/discord/{id}") {
                val discordId = call.parameters["id"]?.toLong() ?: run {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                val user = User.findByDiscordId(discordId)
                if (user != null) call.respond(user.toApiJson())
                else call.respond(HttpStatusCode.NotFound)
            }

            get("/github/{id}") {
                val githubId = call.parameters["id"]?.toLong() ?: run {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                val user = User.findByGithubId(githubId)
                if (user != null) call.respond(user.toApiJson())
                else call.respond(HttpStatusCode.NotFound)
            }

            get("/twitter/{id}") {
                val twitterId = call.parameters["id"]?.toLong() ?: run {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                val user = User.findByTwitterId(twitterId)
                if (user != null) call.respond(user.toApiJson())
                else call.respond(HttpStatusCode.NotFound)
            }

            get("/twitch/{id}") {
                val twitchId = call.parameters["id"]?.toLong() ?: run {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                val user = User.findByTwitchId(twitchId)
                if (user != null) call.respond(user.toApiJson())
                else call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}
