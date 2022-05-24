package dev.synapsetech.tzdb.util

import com.google.common.net.PercentEscaper
import org.apache.commons.codec.digest.HmacUtils
import java.util.*
import java.util.concurrent.ThreadLocalRandom
import kotlin.streams.asSequence

class OAuthEncoder {
    private val escaper = PercentEscaper("_-.", false)

    fun createNonce(): String {
        val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return ThreadLocalRandom
            .current()
            .ints(32, 0, charPool.size)
            .asSequence()
            .map { charPool[it] }
            .joinToString("")
    }

    fun createAuthHeader(consumerKey: String, timestamp: Long, nonce: String, signature: String, token: String): String {
        val pairs = listOf(
            "oauth_consumer_key" to consumerKey,
            "oauth_nonce" to nonce,
            "oauth_signature" to signature,
            "oauth_signature_method" to "HMAC-SHA1",
            "oauth_timestamp" to timestamp.toString(),
            "oauth_token" to token,
            "oauth_version" to "1.0",
        )

        val collected = pairs.joinToString(", ") { (key, value) -> "${escaper.escape(key)}=\"${escaper.escape(value)}\"" }
        return "OAuth $collected"
    }

    private fun hmacSign(signingKey: String, signatureBaseString: String): String {
        val hmacSha1 = HmacUtils.hmacSha1(signingKey, signatureBaseString)
        return Base64.getEncoder().encodeToString(hmacSha1)
    }

    private fun createSigningKey(consumerSecret:String, oauthTokenSecret:String) = StringBuilder()
        .append(escaper.escape(consumerSecret))
        .append("&")
        .append(escaper.escape(oauthTokenSecret))
        .toString()

    private fun createSignatureBaseString(method: String, url: String, parameterString: String) = StringBuilder()
        .append(method.uppercase())
        .append("&")
        .append(escaper.escape(url))
        .append("&")
        .append(escaper.escape(parameterString))
        .toString()

    private fun createParamString(params:List<Pair<String, String>>) = params
            .map { (key, value) -> escaper.escape(key) to escaper.escape(value) }
            .sortedBy { it.first }
            .joinToString("&") { (key, value) -> "$key=$value" }

    fun createSignature(
        consumerSecret: String,
        oAuthTokenSecret: String,
        method: String,
        url: String,
        params: List<Pair<String, String>>
    ): String {
        val paramString = createParamString(params)
        val signatureBaseString = createSignatureBaseString(method, url, paramString)
        val signingKey = createSigningKey(consumerSecret, oAuthTokenSecret)
        return hmacSign(signingKey, signatureBaseString)
    }
}