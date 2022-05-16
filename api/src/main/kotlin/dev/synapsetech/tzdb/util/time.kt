package dev.synapsetech.tzdb.util

import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

fun ZoneId.toApiJson(): Map<String, Any> {
    val offsetFormatter = DateTimeFormatter.ofPattern("xxx")
    val dt = LocalDateTime.now()
    val zdt = dt.atZone(this)

    return mapOf(
        "id" to this.id,
        "offset" to offsetFormatter.format(zdt.offset),
    )
}