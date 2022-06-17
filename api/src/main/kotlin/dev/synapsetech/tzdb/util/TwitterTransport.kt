package dev.synapsetech.tzdb.util

import dev.synapsetech.tzdb.config.MainConfig
import dev.synapsetech.tzdb.httpClient
import io.ktor.client.call.*
import io.ktor.client.request.*
import java.time.Instant
import kotlinx.serialization.Serializable

@Serializable
data class TwitterUser(val email: String, val name: String, val id: Long)

object TwitterTransport {
    private val consumerKey = MainConfig.instance.oauth.twitter.consumerKey
    private val consumerSecret = MainConfig.instance.oauth.twitter.consumerSecret
    private val encoder = OAuthEncoder()

    suspend fun getUser(oAuthTokenSecret: String, oAuthToken: String): TwitterUser {
        val url = "https://api.twitter.com/1.1/account/verify_credentials.json"
        val nonce = encoder.createNonce()
        val timestamp = Instant.now().epochSecond

        val params = listOf(
            "include_email" to "true",
            "oauth_consumer_key" to consumerKey,
            "oauth_nonce" to nonce,
            "oauth_signature_method" to "HMAC-SHA1",
            "oauth_timestamp" to timestamp.toString(),
            "oauth_token" to oAuthToken,
            "oauth_version" to "1.0"
        )

        val signature = encoder.createSignature(
            consumerSecret = consumerSecret,
            oAuthTokenSecret = oAuthTokenSecret,
            method = "get",
            url = url,
            params = params
        )

        val authHeader = encoder.createAuthHeader(
            consumerKey = consumerKey,
            timestamp = timestamp,
            nonce = nonce,
            signature = signature,
            token = oAuthToken
        )

        val response = httpClient.get("$url?include_email=true") {
            header("Authorization", authHeader)
        }

        return response.body()
    }
}
