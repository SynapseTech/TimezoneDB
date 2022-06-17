package dev.synapsetech.tzdb.config

import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.io.File

@Serializable
data class MainConfig(
    val webUrl: String,
    val port: Int,
    val database: DatabaseConfigPart,
    val oauth: OauthConfigPart,
    val jwt: JwtConfigPart,
) {
    companion object {
        lateinit var instance: MainConfig
        private val json = Json { ignoreUnknownKeys = true }

        fun loadFile(file: File) {
            instance = json.decodeFromString(file.readText())
        }
    }
}
