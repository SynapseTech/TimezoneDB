package dev.synapsetech.tzdb.config

import kotlinx.serialization.Serializable
@Serializable
data class OauthCodeGrantProvider(
    val clientId: String,
    val clientSecret: String,
    val redirectUri: String,
)

@Serializable
data class Oauth1aProvider(
    val redirectUri: String,
    val consumerKey: String,
    val consumerSecret: String,
)

@Serializable
data class OauthConfigPart(
    val discord: OauthCodeGrantProvider,
    val github: OauthCodeGrantProvider,
    val twitch: OauthCodeGrantProvider,
    val twitter: Oauth1aProvider,
    val microsoft: OauthCodeGrantProvider,
)


