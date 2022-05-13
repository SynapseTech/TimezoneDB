package dev.synapsetech.tzdb.plugins

import io.ktor.server.auth.*
import kotlinx.serialization.Serializable
import io.ktor.http.*
import io.ktor.server.sessions.*
import io.ktor.server.auth.jwt.*
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.synapsetech.tzdb.config.MainConfig
import dev.synapsetech.tzdb.httpClient
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

// todo: fill all this out

const val discordAuthorizeUrl = "https://discord.com/api/oauth2/authorize"
const val discordTokenUrl = "https://discord.com/api/oauth2/token"


fun Application.configureSecurity() {
    install(Authentication) {
        oauth("auth-oauth-discord") {
            urlProvider = { MainConfig.INSTANCE.oauth.discord.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "discord",
                    authorizeUrl = discordAuthorizeUrl,
                    accessTokenUrl = discordTokenUrl,
                    requestMethod = HttpMethod.Post,
                    clientId = MainConfig.INSTANCE.oauth.discord.clientId,
                    clientSecret = MainConfig.INSTANCE.oauth.discord.clientSecret,
                    defaultScopes = listOf("identify"),
                )
            }
            client = httpClient
        }
    }
    // we have jwt here for authenticated api requests
//    authentication {
//        jwt {
//            val jwtAudience = this@configureSecurity.environment.config.property("jwt.audience").getString()
//            realm = this@configureSecurity.environment.config.property("jwt.realm").getString()
//            verifier(
//                JWT
//                    .require(Algorithm.HMAC256("secret"))
//                    .withAudience(jwtAudience)
//                    .withIssuer(this@configureSecurity.environment.config.property("jwt.domain").getString())
//                    .build()
//            )
//            validate { credential ->
//                if (credential.payload.audience.contains(jwtAudience)) JWTPrincipal(credential.payload) else null
//            }
//        }
//    }

    install(Sessions) {
        cookie<UserSession>("session") {
            cookie.extensions["SameSite"] = "lax"
        }
    }

    routing {
        authenticate("auth-oauth-discord") {
            get("login") {
                call.respondRedirect("/auth/callback/discord")
            }

            get("/auth/callback/discord") {
                val principal: OAuthAccessTokenResponse.OAuth2? = call.principal()
                call.sessions.set(UserSession(principal?.accessToken.toString()))
                call.respondRedirect("/")
            }
        }
    }
}

class UserSession(discordAccessToken: String? = null)
