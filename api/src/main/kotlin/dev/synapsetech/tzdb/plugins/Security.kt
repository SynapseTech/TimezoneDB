package dev.synapsetech.tzdb.plugins

import io.ktor.server.auth.*
import kotlinx.serialization.Serializable
import io.ktor.http.*
import io.ktor.server.auth.jwt.*
import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import dev.synapsetech.tzdb.config.MainConfig
import dev.synapsetech.tzdb.data.User
import dev.synapsetech.tzdb.httpClient
import dev.synapsetech.tzdb.util.TwitterTransport
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import java.util.*

const val discordAuthorizeUrl = "https://discord.com/api/oauth2/authorize"
const val discordTokenUrl = "https://discord.com/api/oauth2/token"

const val githubAuthorizeUrl = "https://github.com/login/oauth/authorize"
const val githubTokenUrl = "https://github.com/login/oauth/access_token"

const val twitchAuthorizeUrl = "https://id.twitch.tv/oauth2/authorize"
const val twitchTokenUrl = "https://id.twitch.tv/oauth2/token"

fun genJwt(userId: Long): String = JWT.create()
    .withAudience(MainConfig.INSTANCE.jwt.audience)
    .withIssuer(MainConfig.INSTANCE.jwt.domain)
    .withClaim("userId", userId)
    .withExpiresAt(Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)) // a week
    .sign(Algorithm.HMAC256(MainConfig.INSTANCE.jwt.secret))

val jwtVerifier: JWTVerifier = JWT
    .require(Algorithm.HMAC256(MainConfig.INSTANCE.jwt.secret))
    .withAudience(MainConfig.INSTANCE.jwt.audience)
    .withIssuer(MainConfig.INSTANCE.jwt.domain)
    .build()

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
                    defaultScopes = listOf("identify", "email"),
                )
            }
            client = httpClient
        }

        oauth("auth-oauth-github") {
            urlProvider = { MainConfig.INSTANCE.oauth.github.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "github",
                    authorizeUrl = githubAuthorizeUrl,
                    accessTokenUrl = githubTokenUrl,
                    requestMethod = HttpMethod.Post,
                    clientId = MainConfig.INSTANCE.oauth.github.clientId,
                    clientSecret = MainConfig.INSTANCE.oauth.github.clientSecret,
                    defaultScopes = listOf("user:email")
                )
            }
            client = httpClient
        }

        oauth("auth-oauth-twitter") {
            urlProvider = { MainConfig.INSTANCE.oauth.twitter.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth1aServerSettings(
                    name = "twitter",
                    requestTokenUrl = "https://api.twitter.com/oauth/request_token",
                    authorizeUrl = "https://api.twitter.com/oauth/authorize",
                    accessTokenUrl = "https://api.twitter.com/oauth/access_token",
                    consumerKey = MainConfig.INSTANCE.oauth.twitter.consumerKey,
                    consumerSecret = MainConfig.INSTANCE.oauth.twitter.consumerSecret,
                )
            }
            client = httpClient
        }

        oauth("auth-oauth-twitch") {
            urlProvider = { MainConfig.INSTANCE.oauth.twitch.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "twitch",
                    authorizeUrl = twitchAuthorizeUrl,
                    accessTokenUrl = twitchTokenUrl,
                    requestMethod = HttpMethod.Post,
                    clientId = MainConfig.INSTANCE.oauth.twitch.clientId,
                    clientSecret = MainConfig.INSTANCE.oauth.twitch.clientSecret,
                    defaultScopes = listOf("user:read:email")
                )
            }
            client = httpClient
        }

        jwt("auth-jwt") {
            realm = MainConfig.INSTANCE.jwt.realm
            verifier(jwtVerifier)
            validate { credential ->
                if (credential.payload.getClaim("userId").asLong() != null)
                    JWTPrincipal(credential.payload)
                else null
            }
        }
    }

    routing {
        get("/auth/discord") {
            call.request.queryParameters["intent"]?.let { intent ->
                if (intent == "link") {
                    val jwt = call.request.queryParameters["token"] ?: run {
                        call.respond(HttpStatusCode.BadRequest)
                        return@get
                    }

                    val decoded = jwtVerifier.verify(jwt)
                    val userId = decoded.getClaim("userId").asLong() ?: run {
                        call.respond(HttpStatusCode.Unauthorized)
                        return@get
                    }

                    call.response.cookies.append("tzdb-link-user", userId.toString())
                }
            }

            call.respondRedirect("/auth/login/discord")
        }

        authenticate("auth-oauth-discord") {
            get("/auth/login/discord") {
                call.respondRedirect("/auth/callback/discord")
            }

            get("/auth/callback/discord") {
                val principal: OAuthAccessTokenResponse.OAuth2? = call.principal()

                var link = false
                var userId: Long? = null

                call.request.cookies["tzdb-link-user"]?.let {
                    link = true
                    userId = it.toLongOrNull()
                }

                call.response.cookies.appendExpired("tzdb-link-user")

                if (link && userId == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                val response = httpClient.get("https://discord.com/api/users/@me") {
                    headers {
                        append("Authorization", "Bearer ${principal?.accessToken}")
                    }
                }

                val discordUser: DiscordUser = response.body()
                val discordId = discordUser.id.toLong()

                if (link) {
                    val possibleOtherUser = User.findByDiscordId(discordId)
                    if (possibleOtherUser != null) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.discordId = discordId
                    thisUser.save()
                } else {
                    val possibleUser = User.findByDiscordId(discordId)
                    userId = if (possibleUser != null) possibleUser._id
                    else {
                        val emailUser = User.findByEmail(discordUser.email)
                        if (emailUser != null) {
                            emailUser.discordId = discordId
                            emailUser.save()
                            emailUser._id
                        } else {
                            val user = User(
                                discordId = discordId,
                                username = discordUser.username,
                                email = discordUser.email,
                            )
                            user.save()
                            user._id
                        }
                    }
                }

                val token = genJwt(userId!!)
                val webUri = Url(MainConfig.INSTANCE.webUrl).toURI().resolve("/?token=$token")
                call.respondRedirect(webUri.toString())
            }
        }

        get("/auth/github") {
            call.request.queryParameters["intent"]?.let { intent ->
                if (intent == "link") {
                    val jwt = call.request.queryParameters["token"] ?: run {
                        call.respond(HttpStatusCode.BadRequest)
                        return@get
                    }

                    val decoded = jwtVerifier.verify(jwt)
                    val userId = decoded.getClaim("userId").asLong() ?: run {
                        call.respond(HttpStatusCode.Unauthorized)
                        return@get
                    }

                    call.response.cookies.append("tzdb-link-user", userId.toString())
                }
            }

            call.respondRedirect("/auth/login/github")
        }

        authenticate("auth-oauth-github") {
            get("/auth/login/github") {
                call.respondRedirect("/auth/callback/github")
            }

            get("/auth/callback/github") {
                val principal: OAuthAccessTokenResponse.OAuth2? = call.principal()

                var link = false
                var userId: Long? = null

                call.request.cookies["tzdb-link-user"]?.let {
                    link = true
                    userId = it.toLongOrNull()
                }

                call.response.cookies.appendExpired("tzdb-link-user")

                if (link && userId == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                call.application.environment.log.info("link: $link")

                val response = httpClient.get("https://api.github.com/user") {
                    headers {
                        append("Accept", "application/vnd.github.v3+json")
                        append("Authorization", "token ${principal?.accessToken}")
                    }
                }

                val githubUser: GithubUser = response.body()
                val githubId = githubUser.id

                if (link) {
                    val possibleOtherUser = User.findByGithubId(githubId)
                    if (possibleOtherUser != null) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.githubId = githubId
                    thisUser.save()
                } else {
                    val possibleUser = User.findByGithubId(githubId)
                    userId = if (possibleUser != null) possibleUser._id
                    else {
                        val emailUser = User.findByEmail(githubUser.email)
                        if (emailUser != null) {
                            emailUser.githubId = githubId
                            emailUser.save()
                            emailUser._id
                        } else {
                            val user = User(
                                githubId = githubId,
                                username = githubUser.login,
                                email = githubUser.email,
                            )
                            user.save()
                            user._id
                        }
                    }
                }

                val token = genJwt(userId!!)
                val webUri = Url(MainConfig.INSTANCE.webUrl).toURI().resolve("/?token=$token")
                call.respondRedirect(webUri.toString())
            }
        }

        get("/auth/twitter") {
            call.request.queryParameters["intent"]?.let { intent ->
                if (intent == "link") {
                    val jwt = call.request.queryParameters["token"] ?: run {
                        call.respond(HttpStatusCode.BadRequest)
                        return@get
                    }

                    val decoded = jwtVerifier.verify(jwt)
                    val userId = decoded.getClaim("userId").asLong() ?: run {
                        call.respond(HttpStatusCode.Unauthorized)
                        return@get
                    }

                    call.response.cookies.append("tzdb-link-user", userId.toString())
                }
            }

            call.respondRedirect("/auth/login/twitter")
        }

        authenticate("auth-oauth-twitter") {
            get("/auth/login/twitter") {
                call.respondRedirect("/auth/callback/twitter")
            }

            get("/auth/callback/twitter") {
                val principal: OAuthAccessTokenResponse.OAuth1a = call.principal() ?: run {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                var link = false
                var userId: Long? = null

                call.request.cookies["tzdb-link-user"]?.let {
                    link = true
                    userId = it.toLongOrNull()
                }

                if (link && userId == null) {
                    call.respond(HttpStatusCode.BadRequest);
                    return@get
                }

                val (email, name, twitterId) = TwitterTransport.getUser(principal.tokenSecret, principal.token)

                if (link) {
                    val possibleOtherUser = User.findByTwitterId(twitterId)
                    if (possibleOtherUser != null) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.twitterId = twitterId
                    thisUser.save()
                } else {
                    val possibleUser = User.findByTwitterId(twitterId)
                    userId = if (possibleUser != null) possibleUser._id
                    else {
                        val emailUser = User.findByEmail(email)
                        if (emailUser != null) {
                            emailUser.twitterId = twitterId
                            emailUser.save()
                            emailUser._id
                        } else {
                            val user = User(
                                twitterId = twitterId,
                                username = name,
                                email = email,
                            )
                            user.save()
                            user._id
                        }
                    }
                }

                val token = genJwt(userId!!)
                val webUri = Url(MainConfig.INSTANCE.webUrl).toURI().resolve("/?token=$token")
                call.respondRedirect(webUri.toString())
            }
        }

        get("/auth/twitch") {
            call.request.queryParameters["intent"]?.let { intent ->
                if (intent == "link") {
                    val jwt = call.request.queryParameters["token"] ?: run {
                        call.respond(HttpStatusCode.BadRequest)
                        return@get
                    }

                    val decoded = jwtVerifier.verify(jwt)
                    val userId = decoded.getClaim("userId").asLong() ?: run {
                        call.respond(HttpStatusCode.Unauthorized)
                        return@get
                    }

                    call.response.cookies.append("tzdb-link-user", userId.toString())
                }
            }

            call.respondRedirect("/auth/login/twitch")
        }

        authenticate("auth-oauth-twitch") {
            get("/auth/login/twitch") {
                call.respondRedirect("/auth/callback/twitch")
            }

            get("/auth/callback/twitch") {
                val principal: OAuthAccessTokenResponse.OAuth2? = call.principal()

                var link = false
                var userId: Long? = null

                call.request.cookies["tzdb-link-user"]?.let {
                    link = true
                    userId = it.toLongOrNull()
                }

                if (link && userId == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                val response = httpClient.get("https://api.twitch.tv/helix/users") {
                    headers {
                        append("Accept", "application/json")
                        append("Authorization", "Bearer ${principal?.accessToken}")
                        append("Client-Id", MainConfig.INSTANCE.oauth.twitch.clientId)
                    }
                }

                val twitchResponse: TwitchResponse = response.body()
                val twitchUser = twitchResponse.data[0]
                val twitchId = twitchUser.id.toLong()

                if (link) {
                    val possibleOtherUser = User.findByTwitchId(twitchId)
                    if (possibleOtherUser != null && possibleOtherUser._id != userId) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.twitchId = twitchId
                    thisUser.save()
                } else {
                    val possibleUser = User.findByTwitchId(twitchId)
                    userId = if (possibleUser != null) possibleUser._id
                    else {
                        val emailUser = User.findByEmail(twitchUser.email)
                        if (emailUser != null) {
                            emailUser.twitchId = twitchId
                            emailUser.save()
                            emailUser._id
                        } else {
                            val user = User(
                                twitchId = twitchId,
                                username = twitchUser.display_name,
                                email = twitchUser.email,
                            )
                            user.save()
                            user._id
                        }
                    }
                }

                val token = genJwt(userId!!)
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
    val email: String,
)

@Serializable data class GithubUser(
    val id: Long,
    val email: String,
    val login: String,
)

@Serializable data class TwitchUser(
    val id: String,
    val display_name: String,
    val email: String,
)

@Serializable data class TwitchResponse(
    val data: List<TwitchUser>,
)
