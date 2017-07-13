class Event {
    constructor(title, date, time, place, categories,
        likes, user, details, photo) {
        this.title = title;
        this.date = date;
        this.time = time;
        this.place = place;
        this.likes = likes;
        this.user = user;
        this.details = details;
        this.photo = photo;
        this.categories = categories;
    }
}

module.exports = Event;
