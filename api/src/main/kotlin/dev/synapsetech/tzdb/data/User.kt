package dev.synapsetech.tzdb.data

import kotlinx.serialization.Serializable
import org.litote.kmongo.*

@Serializable
data class User(
    val username: String,
    val _id: Long = snowflake.nextId(),
    var discordId: Long? = null
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
