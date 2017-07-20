const Validator = {
    isValidUser(userObj) {
        // const props = ['username', 'password', 'firstName',
        //     'lastName', 'email', 'age', 'avatar'];

        // for (const prop in props) {
        //     if (!userObj.hasOwnProperty(props[prop])) {
        //         return false;
        //     }
        // }

        return true;
    },
    isValidEvent(eventObj) {
        // const props = ['title', 'date', 'time',
        //     'place', 'likes', 'user', 'details', 'photo'];

        // for (const prop in props) {
        //     if (!eventObj.hasOwnProperty(props[prop])) {
        //         return false;
        //     }
        // }

        return true;
    },
    isValidCategory(categoryObj) {
        if (!categoryObj.hasOwnProperty('name')) {
            return false;
        }

        return true;
    },
    isValidMessage(msgObj) {
        const props = ['room', 'content', 'time',
            'user'];

        for (const prop in props) {
            if (!msgObj.hasOwnProperty(props[prop])) {
                return false;
            }
        }

        return true;
    },
};

module.exports = { Validator };
