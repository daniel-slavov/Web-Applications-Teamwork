class CategoriesData {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('categories');
    }
}

module.exports = CategoriesData;
