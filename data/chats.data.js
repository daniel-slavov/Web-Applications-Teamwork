const Message = require('../models/message');

class ChatsData {
    constructor(db, validator) {
        this.db = db;
        this.collection = this.db.collection('chats');
        this.validator = validator;
    }

    getLatestMessages(chatRoom) {
        return this.collection.find({ room: chatRoom })
            .toArray();
    }

    addMessage(msg) {
        if (this.validator.isValidMessage(msg)) {
            const message = new Message(msg);
            this.collection.insertOne(message);
        }
    }
}

module.exports = ChatsData;
