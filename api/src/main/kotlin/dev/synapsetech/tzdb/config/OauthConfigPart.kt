package dev.synapsetech.tzdb.config

import kotlinx.serialization.Serializable

@Serializable
data class OauthConfigPart(
    val discord: OauthCodeGrantProvider,
) {
    @Serializable
    data class OauthCodeGrantProvider(
        val clientId: String,
        val clientSecret: String,
        val redirectUri: String,
    )
}
