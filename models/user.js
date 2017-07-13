class User {
    constructor(username, password, firstName, lastName, email, age, avatar) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.age = age;
        this.avatar = avatar;
        this.events = [];
    }
}

module.exports = User;
