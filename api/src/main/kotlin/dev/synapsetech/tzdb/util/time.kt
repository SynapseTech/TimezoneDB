package dev.synapsetech.tzdb.util

import java.time.LocalDateTime
import java.time.ZoneId
import kotlinx.serialization.Serializable
import java.time.format.DateTimeFormatter

fun ZoneId.toApiJson(): ZoneInfoJson {
    val offsetFormatter = DateTimeFormatter.ofPattern("xxx")
    val dt = LocalDateTime.now()
    val zdt = dt.atZone(this)

    return ZoneInfoJson(
        this.id,
        offsetFormatter.format(zdt.offset),
    )
}

@Serializable
data class ZoneInfoJson(
    val id: String,
    val offset: String
)