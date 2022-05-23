package dev.synapsetech.tzdb.data

import dev.synapsetech.tzdb.util.ZoneInfoJson
import dev.synapsetech.tzdb.util.toApiJson
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.util.pipeline.*
import kotlinx.serialization.Serializable
import org.litote.kmongo.*
import java.time.ZoneId

@Serializable
data class User(
    val username: String,
    val _id: Long = snowflake.nextId(),
    var email: String,
    var discordId: Long? = null,
    var githubId: Long? = null,
    var zoneId: String = "UTC",
) {
    fun save() {
        val col = getCollection()
        val possibleUser = findById(_id);
        if (possibleUser == null) col.insertOne(this)
        else col.replaceOneById(_id, this)
    }

    fun delete() {
        getCollection().deleteOneById(_id)
    }

    fun toApiJson() = Json(_id, username, discordId, githubId, ZoneId.of(zoneId).toApiJson())

    companion object {
        @Serializable data class Json(
            val id: Long,
            val username: String,
            val discordId: Long?,
            val githubId: Long?,
            val timezoneInfo: ZoneInfoJson,
        )

        private const val COLLECTION_NAME = "users"

        fun getCollection() = Mongo.database.getCollection<User>(COLLECTION_NAME)
        fun findById(id: Long) = getCollection().findOneById(id)
        fun findByEmail(email: String) = getCollection().findOne(User::email eq email)
        fun findByDiscordId(discordId: Long) = getCollection().findOne(User::discordId eq discordId)
        fun findByGithubId(githubId: Long) = getCollection().findOne(User::githubId eq githubId)
    }
}

fun PipelineContext<Unit, ApplicationCall>.getUser(): User? {
    val principal = call.principal<JWTPrincipal>()
    val userId = principal!!.payload.getClaim("userId").asLong()
    return User.findById(userId)
}
