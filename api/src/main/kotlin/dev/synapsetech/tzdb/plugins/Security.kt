package dev.synapsetech.tzdb.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import dev.synapsetech.tzdb.config.MainConfig
import dev.synapsetech.tzdb.data.User
import dev.synapsetech.tzdb.httpClient
import dev.synapsetech.tzdb.util.TwitterTransport
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import java.math.BigInteger
import java.util.*

const val discordAuthorizeUrl = "https://discord.com/api/oauth2/authorize"
const val discordTokenUrl = "https://discord.com/api/oauth2/token"

const val githubAuthorizeUrl = "https://github.com/login/oauth/authorize"
const val githubTokenUrl = "https://github.com/login/oauth/access_token"

const val twitchAuthorizeUrl = "https://id.twitch.tv/oauth2/authorize"
const val twitchTokenUrl = "https://id.twitch.tv/oauth2/token"

const val microsoftAuthorizeUrl = "https://login.live.com/oauth20_authorize.srf"
const val microsoftTokenUrl = "https://login.live.com/oauth20_token.srf"

fun genJwt(userId: Long): String = JWT.create()
    .withAudience(MainConfig.instance.jwt.audience)
    .withIssuer(MainConfig.instance.jwt.domain)
    .withClaim("userId", userId)
    .withExpiresAt(Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)) // a week
    .sign(Algorithm.HMAC256(MainConfig.instance.jwt.secret))

val jwtVerifier: JWTVerifier = JWT
    .require(Algorithm.HMAC256(MainConfig.instance.jwt.secret))
    .withAudience(MainConfig.instance.jwt.audience)
    .withIssuer(MainConfig.instance.jwt.domain)
    .build()

fun Application.configureSecurity() {
    install(Authentication) {
        oauth("auth-oauth-discord") {
            urlProvider = { MainConfig.instance.oauth.discord.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "discord",
                    authorizeUrl = discordAuthorizeUrl,
                    accessTokenUrl = discordTokenUrl,
                    requestMethod = HttpMethod.Post,
                    clientId = MainConfig.instance.oauth.discord.clientId,
                    clientSecret = MainConfig.instance.oauth.discord.clientSecret,
                    defaultScopes = listOf("identify", "email"),
                )
            }
            client = httpClient
        }

        oauth("auth-oauth-github") {
            urlProvider = { MainConfig.instance.oauth.github.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "github",
                    authorizeUrl = githubAuthorizeUrl,
                    accessTokenUrl = githubTokenUrl,
                    requestMethod = HttpMethod.Post,
                    clientId = MainConfig.instance.oauth.github.clientId,
                    clientSecret = MainConfig.instance.oauth.github.clientSecret,
                    defaultScopes = listOf("user:email")
                )
            }
            client = httpClient
        }

        oauth("auth-oauth-twitter") {
            urlProvider = { MainConfig.instance.oauth.twitter.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth1aServerSettings(
                    name = "twitter",
                    requestTokenUrl = "https://api.twitter.com/oauth/request_token",
                    authorizeUrl = "https://api.twitter.com/oauth/authorize",
                    accessTokenUrl = "https://api.twitter.com/oauth/access_token",
                    consumerKey = MainConfig.instance.oauth.twitter.consumerKey,
                    consumerSecret = MainConfig.instance.oauth.twitter.consumerSecret,
                )
            }
            client = httpClient
        }

        oauth("auth-oauth-twitch") {
            urlProvider = { MainConfig.instance.oauth.twitch.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "twitch",
                    authorizeUrl = twitchAuthorizeUrl,
                    accessTokenUrl = twitchTokenUrl,
                    requestMethod = HttpMethod.Post,
                    clientId = MainConfig.instance.oauth.twitch.clientId,
                    clientSecret = MainConfig.instance.oauth.twitch.clientSecret,
                    defaultScopes = listOf("user:read:email")
                )
            }
            client = httpClient
        }

        oauth("auth-oauth-microsoft") {
            urlProvider = { MainConfig.instance.oauth.microsoft.redirectUri }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "microsoft",
                    authorizeUrl = microsoftAuthorizeUrl,
                    accessTokenUrl = microsoftTokenUrl,
                    requestMethod = HttpMethod.Post,
                    clientId = MainConfig.instance.oauth.microsoft.clientId,
                    clientSecret = MainConfig.instance.oauth.microsoft.clientSecret,
                    defaultScopes = listOf("XboxLive.signin", "Xboxlive.offline_access", "User.Read")
                )
            }
            client = httpClient
        }

        jwt("auth-jwt") {
            val jwtAudience = MainConfig.instance.jwt.audience
            realm = MainConfig.instance.jwt.realm
            verifier(jwtVerifier)
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience) && credential.payload.getClaim("userId").asLong() != null)
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
                        append("User-Agent", "TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                    }
                }

                val discordUser: DiscordUser = response.body()
                val discordId = discordUser.id.toLong()

                val possibleOtherUser = User.findByDiscordId(discordId)
                if (link) {
                    if (possibleOtherUser != null && possibleOtherUser._id != userId) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.discordId = discordId
                    thisUser.save()
                } else {
                    userId = if (possibleOtherUser != null) possibleOtherUser._id
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
                val webUri = Url(MainConfig.instance.webUrl).toURI().resolve("/?token=$token")
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

                val response = httpClient.get("https://api.github.com/user") {
                    headers {
                        append("Accept", "application/vnd.github.v3+json")
                        append("Authorization", "token ${principal?.accessToken}")
                        append("User-Agent", "TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                    }
                }

                val githubUser: GithubUser = response.body()
                val githubId = githubUser.id

                val githubEmail: String = githubUser.email ?: run {
                    val emailResponse = httpClient.get("https://api.github.com/user/emails") {
                        headers {
                            append("Accept", "application/vnd.github.v3+json")
                            append("Authorization", "token ${principal?.accessToken}")
                            append("User-Agent", "TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                        }
                    }

                    val emails: List<GithubUserEmail> = emailResponse.body()
                    emails.find { it.primary }!!.email
                }

                val possibleOtherUser = User.findByGithubId(githubId)
                if (link) {
                    if (possibleOtherUser != null && possibleOtherUser._id != userId) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.githubId = githubId
                    thisUser.save()
                } else {
                    userId = if (possibleOtherUser != null) possibleOtherUser._id
                    else {
                        val emailUser = User.findByEmail(githubEmail)
                        if (emailUser != null) {
                            emailUser.githubId = githubId
                            emailUser.save()
                            emailUser._id
                        } else {
                            val user = User(
                                githubId = githubId,
                                username = githubUser.login,
                                email = githubEmail,
                            )
                            user.save()
                            user._id
                        }
                    }
                }

                val token = genJwt(userId!!)
                val webUri = Url(MainConfig.instance.webUrl).toURI().resolve("/?token=$token")
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

                val possibleOtherUser = User.findByTwitterId(twitterId)
                if (link) {
                    if (possibleOtherUser != null && possibleOtherUser._id != userId) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.twitterId = twitterId
                    thisUser.save()
                } else {
                    userId = if (possibleOtherUser != null) possibleOtherUser._id
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
                val webUri = Url(MainConfig.instance.webUrl).toURI().resolve("/?token=$token")
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
                        append("Client-Id", MainConfig.instance.oauth.twitch.clientId)
                        append("User-Agent", "TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                    }
                }

                val twitchResponse: TwitchResponse = response.body()
                val twitchUser = twitchResponse.data[0]
                val twitchId = twitchUser.id.toLong()

                val possibleOtherUser = User.findByTwitchId(twitchId)
                if (link) {
                    if (possibleOtherUser != null && possibleOtherUser._id != userId) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.twitchId = twitchId
                    thisUser.save()
                } else {
                    userId = if (possibleOtherUser != null) possibleOtherUser._id
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
                val webUri = Url(MainConfig.instance.webUrl).toURI().resolve("/?token=$token")
                call.respondRedirect(webUri.toString())
            }
        }

        get("/auth/microsoft") {
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

            call.respondRedirect("/auth/login/microsoft")
        }

        authenticate("auth-oauth-microsoft") {
            get("/auth/login/microsoft") {
                call.respondRedirect("/auth/callback/microsoft")
            }

            get("/auth/callback/microsoft") {
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

                val xboxTokenResponse = httpClient.post("https://user.auth.xboxlive.com:443/user/authenticate") {
                    headers {
                        append("x-xbl-contract-version", "1")
                    }
                    userAgent("TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                    contentType(ContentType.Application.Json)
                    accept(ContentType.Application.Json)
                    setBody(XboxTokenRequest(
                        XboxTokenRequest.Companion.PropertiesData(
                            "RPS",
                            "user.auth.xboxlive.com",
                            "d=${principal!!.accessToken}"
                        ),
                        "http://auth.xboxlive.com",
                        "JWT"
                    ))
                }

                val xboxTokenResponseData: XboxTokenResponse = xboxTokenResponse.body()
                val xboxToken = xboxTokenResponseData.Token
                val xboxUhs = xboxTokenResponseData.DisplayClaims.xui[0].uhs

                val xstsTokenResponse = httpClient.post("https://xsts.auth.xboxlive.com:443/xsts/authorize") {
                    headers {
                        append("x-xbl-contract-version", "1")
                    }
                    userAgent("TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                    contentType(ContentType.Application.Json)
                    accept(ContentType.Application.Json)
                    setBody(XstsTokenRequest(
                        XstsTokenRequest.Companion.PropertiesData("RETAIL", listOf(xboxToken)),
                        "rp://api.minecraftservices.com/",
                        "JWT"
                    ))
                }
                val xstsTokenResponseData: XboxTokenResponse = xstsTokenResponse.body()
                val xstsToken = xstsTokenResponseData.Token

                val minecraftTokenResponse = httpClient.post("https://api.minecraftservices.com:443/authentication/login_with_xbox") {
                    userAgent("TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                    contentType(ContentType.Application.Json)
                    accept(ContentType.Application.Json)
                    setBody(MinecraftTokenRequest(
                        "XBL3.0 x=${xboxUhs};${xstsToken}"
                    ))
                }

                val minecraftTokenResponseData: MinecraftTokenResponse = minecraftTokenResponse.body()

                val minecraftProfileResponse = httpClient.get("https://api.minecraftservices.com:443/minecraft/profile") {
                    headers {
                        append("Authorization", "Bearer ${minecraftTokenResponseData.access_token}")
                    }
                    userAgent("TimezoneDB Authentication Agent/1.0 (+https://tzdb.synapsetech.dev)")
                    accept(ContentType.Application.Json)
                }

                val minecraftProfile: MinecraftProfile = minecraftProfileResponse.body()

                val bi1 = BigInteger(minecraftProfile.id.substring(0, 16), 16)
                val bi2 = BigInteger(minecraftProfile.id.substring(16, 32), 16)
                val minecraftUUID = UUID(bi1.toLong(), bi2.toLong()).toString()

                val possibleOtherUser = User.findByMinecraftUUID(minecraftUUID)
                if (link) {
                    if (possibleOtherUser != null && possibleOtherUser._id != userId) {
                        call.respond(HttpStatusCode.BadRequest, "Account already linked")
                        return@get
                    }

                    val thisUser = User.findById(userId!!)!!
                    thisUser.minecraftUUID = minecraftUUID
                    thisUser.save()
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Cannot use Minecraft for login.")
                }
//
                val token = genJwt(userId!!)
                val webUri = Url(MainConfig.instance.webUrl).toURI().resolve("/?token=$token")
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
    val email: String?,
    val login: String,
)

@Serializable data class GithubUserEmail(
    val email: String,
    val primary: Boolean,
)

@Serializable data class TwitchUser(
    val id: String,
    val display_name: String,
    val email: String,
)

@Serializable data class TwitchResponse(
    val data: List<TwitchUser>,
)

@Serializable data class XboxTokenRequest(
    val Properties: PropertiesData,
    val RelyingParty: String,
    val TokenType: String,
) {
    companion object {
        @Serializable data class PropertiesData(
            val AuthMethod: String,
            val SiteName: String,
            val RpsTicket: String, // Microsoft naming at its finest. This is a JWT.
        )
    }
}

@Serializable data class XboxTokenResponse(
    val IssueInstant: String,
    val NotAfter: String,
    val Token: String,
    val DisplayClaims: DisplayClaimsData,
) {
    companion object {
        @Serializable data class DisplayClaimsData(
            val xui: List<UserHashData>,
        )

        @Serializable data class UserHashData(
            val uhs: String,
        )
    }
}

@Serializable data class XstsTokenRequest(
    val Properties: PropertiesData,
    val RelyingParty: String,
    val TokenType: String
) {
    companion object {
        @Serializable data class PropertiesData(
            val SandboxId: String,
            val UserTokens: List<String>,
        )
    }
}

@Serializable data class MinecraftTokenRequest(
    val identityToken: String,
    val ensureLegacyEnabled: Boolean = true,
)

@Serializable data class MinecraftTokenResponse(
    val username: String,
    val access_token: String,
)

@Serializable data class MinecraftProfile(
    val name: String,
    val id: String,
)