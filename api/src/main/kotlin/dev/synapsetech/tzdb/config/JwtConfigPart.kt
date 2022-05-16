package dev.synapsetech.tzdb.config

import kotlinx.serialization.Serializable

@Serializable
data class JwtConfigPart(
    val secret: String,
    val audience: String,
    val realm: String,
    val domain: String,
)
