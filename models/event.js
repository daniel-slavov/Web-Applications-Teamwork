class Event {
    constructor(object) {
        this.title = object.title;
        this.date = object.date;
        this.time = object.time;
        this.place = object.place;
        this.likes = object.likes;
        this.user = object.user;
        this.details = object.details;
        this.photo = object.photo;
        this.categories = object.categories;
    }
}

module.exports = Event;
