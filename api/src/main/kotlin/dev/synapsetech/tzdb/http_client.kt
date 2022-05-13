package dev.synapsetech.tzdb

import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val httpClient = HttpClient(Apache) {
    install(ContentNegotiation) {
        json()
    }
}