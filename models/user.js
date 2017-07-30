class User {
    constructor(object) {
        this.username = object.username;
        this.password = object.password;
        this.firstName = object.firstName;
        this.lastName = object.lastName;
        this.email = object.email;
        this.age = object.age;
        this.avatar = object.avatar;
        this.events = [];
        this.votedEvents = [];
    }
}

module.exports = User;
