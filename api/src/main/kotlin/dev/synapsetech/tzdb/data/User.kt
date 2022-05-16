package dev.synapsetech.tzdb.data

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.util.pipeline.*
import kotlinx.serialization.Serializable
import org.litote.kmongo.*

@Serializable
data class User(
    val username: String,
    val _id: Long = snowflake.nextId(),
    var discordId: Long? = null,
    var zoneId: String = "UTC",
) {
    fun save() {
        val col = getCollection()
        val possibleUser = findById(_id);
        if (possibleUser == null) col.insertOne(this)
        else col.replaceOneById(_id, this)
    }

    companion object {
        private const val COLLECTION_NAME = "users"

        fun getCollection() = Mongo.database.getCollection<User>(COLLECTION_NAME)
        fun findById(id: Long) = getCollection().findOneById(id)
        fun findByDiscordId(discordId: Long) = getCollection().findOne(User::discordId eq discordId)
    }
}

fun PipelineContext<Unit, ApplicationCall>.getUser(): User? {
    val principal = call.principal<JWTPrincipal>()
    val userId = principal!!.payload.getClaim("userId").asLong()
    return User.findById(userId)
}
