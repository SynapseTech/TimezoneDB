package dev.synapsetech.tzdb.config

import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.io.File

@Serializable
data class MainConfig(
    val port: Int,
    val oauth: OauthConfigPart,
) {
    companion object {
        lateinit var INSTANCE: MainConfig

        fun loadFile(file: File) {
            INSTANCE = Json.decodeFromString(file.readText())
        }
    }
}
