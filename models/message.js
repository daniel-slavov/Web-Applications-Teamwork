class Message {
    constructor(msgObj) {
        this.room = msgObj.room;
        this.user = msgObj.user;
        this.content = msgObj.content;
        this.time = msgObj.time;
        this.avatar = msgObj.avatar;
    }
}

module.exports = Message;
