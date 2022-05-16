package dev.synapsetech.tzdb.config

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseConfigPart(
    val mongoUri: String,
    val mongoDatabase: String,
)