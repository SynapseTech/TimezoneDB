package dev.synapsetech.tzdb

import dev.synapsetech.tzdb.config.MainConfig
import dev.synapsetech.tzdb.data.Mongo
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import dev.synapsetech.tzdb.plugins.*
import java.io.File

fun main(args: Array<String>) {
    val configFile = if (args.isEmpty()) {
        println("No config specified, defaulting to ./config.json")
        "./config.json"
    } else args[0]
    MainConfig.loadFile(File(configFile))
    Mongo.init(MainConfig.INSTANCE.database)

    embeddedServer(Netty, port = MainConfig.INSTANCE.port, host = "0.0.0.0") {
        configureHTTP()
        configureRouting()
        configureSecurity()
        configureSerialization()
    }.start(wait = true)
}
