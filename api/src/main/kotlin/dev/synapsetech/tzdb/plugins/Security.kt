package dev.synapsetech.tzdb.plugins

import io.ktor.server.auth.*
import kotlinx.serialization.Serializable
import io.ktor.http.*
import io.ktor.server.sessions.*
import io.ktor.server.auth.jwt.*
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.synapsetech.tzdb.config.MainConfig
import dev.synapsetech.tzdb.data.User
import dev.synapsetech.tzdb.httpClient
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.pipeline.*
import kotlinx.coroutines.MainScope
import java.util.*

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

        jwt {
            val jwtAudience = MainConfig.INSTANCE.jwt.audience
            realm = MainConfig.INSTANCE.jwt.realm
            verifier(
                JWT
                    .require(Algorithm.HMAC256(MainConfig.INSTANCE.jwt.secret))
                    .withAudience(jwtAudience)
                    .withIssuer(MainConfig.INSTANCE.jwt.domain)
                    .build()
            )
            validate { credential ->
                if (credential.payload.getClaim("userId").asLong() != null)
                    JWTPrincipal(credential.payload)
                else null
            }
        }
    }

    routing {
        authenticate("auth-oauth-discord") {
            get("login") {
                call.respondRedirect("/auth/callback/discord")
            }

            get("/auth/callback/discord") {
                val principal: OAuthAccessTokenResponse.OAuth2? = call.principal()

                val response = httpClient.get("https://discord.com/api/users/@me") {
                    headers {
                        append("Authorization", "Bearer ${principal?.accessToken}")
                    }
                }

                val discordUser: DiscordUser = response.body()
                val discordId = discordUser.id.toLong()

                val possibleUser = User.findByDiscordId(discordId)
                val userId = if (possibleUser == null) {
                    // user not logged in, create user with this discord id
                    val user = User(
                        discordId = discordId,
                        username = "${discordUser.username}#${discordUser.discriminator}"
                    )
                    user.save()
                    user._id
                } else possibleUser._id

                val token = JWT.create()
                    .withAudience(MainConfig.INSTANCE.jwt.audience)
                    .withIssuer(MainConfig.INSTANCE.jwt.domain)
                    .withClaim("userId", userId)
                    .withExpiresAt(Date(System.currentTimeMillis() + 60000))
                    .sign(Algorithm.HMAC256(MainConfig.INSTANCE.jwt.secret))

                val webUri = Url(MainConfig.INSTANCE.webUrl).toURI().resolve("/?token=$token")

                call.respondRedirect(webUri.toString())
            }
        }
    }
}

@Serializable data class DiscordUser(
    val id: String,
    val username: String,
    val discriminator: String,
)

class UserSession(val userId: Long? = null)
