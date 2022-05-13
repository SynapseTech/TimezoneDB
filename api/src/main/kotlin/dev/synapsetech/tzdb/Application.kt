package dev.synapsetech.tzdb

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import dev.synapsetech.tzdb.plugins.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureRouting()
        configureSecurity()
        configureHTTP()
        configureSerialization()
    }.start(wait = true)
}
