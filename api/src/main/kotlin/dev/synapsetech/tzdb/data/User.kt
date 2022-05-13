package dev.synapsetech.tzdb.data

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Long,
    val discordId: Long? = null
)
