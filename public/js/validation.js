function validateUserForm() {
    let errors = [];

    const username = document.forms["signUp"]["username"].value;

    if (username.length < 6 || username.length > 25) {
        errors.push('Username must be between 6 and 25 symbols.');
    }

    const password = document.forms["signUp"]["password"].value;

    if (password.length < 6) {
        errors.push('Passsword must be at least 6 symbols.');
    }

    const passwordConfirm = document.forms["signUp"]["passwordConfirm"].value;

    if (passwordConfirm !== password) {
        errors.push('Passwords do not match.');
    }

    const email = document.forms["signUp"]["email"].value;

    if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        errors.push('Email is not valid');
    }

    if (errors.length > 0) {
        const errorsText = errors.join('\n');
        for (let i = 0; i < errors.length; i++) {
            $('<p></p>').appendTo('#validation-errors').text(errors[i]);
        }
        $('#validation-errors').addClass('alert alert-danger');
        return false;
    } else {
        return true;
    }
};

function validateUserUpdate(data) {
    if (!data.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        $('#validation-errors').addClass('alert alert-danger').text('Email is not valid');
        return false;
    } else {
        return true;
    }
};

function validateEventForm() {
    let errors = [];

    const title = document.forms["createEvent"]["title"].value;

    if (title.length < 6) {
        errors.push('Title must be at least 6 symbols.');
    }

    const date = document.forms["createEvent"]["date"].value;

    if (!date.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)) {
        errors.push('Date is not correct.');
    }

    const time = document.forms["createEvent"]["time"].value;

    if (time === '') {
        errors.push('Time is required.');
    }

    const place = document.forms["createEvent"]["place"].value;

    if (place === '') {
        errors.push('Place is required.');
    }

    const categories = document.forms["createEvent"]["categories"].value;

    if (categories === '') {
        errors.push('Category is required.');
    }

    if (errors.length > 0) {
        const errorsText = errors.join('\n');
        for (let i = 0; i < errors.length; i++) {
            $('<p></p>').appendTo('#validation-errors').text(errors[i]);
        }
        $('#validation-errors').addClass('alert alert-danger');
        return false;
    } else {
        return true;
    }
};

function validateEventUpdate(data) {
    let errors = [];

    if (!data.date.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)) {
        errors.push('Date is not correct.');
    }

    if (data.time === '') {
        errors.push('Time is required.');
    }

    if (data.place === '') {
        errors.push('Place is required.');
    }

    if (errors.length > 0) {
        const errorsText = errors.join('\n');
        for (let i = 0; i < errors.length; i++) {
            $('<p></p>').appendTo('#validation-errors').text(errors[i]);
        }
        $('#validation-errors').addClass('alert alert-danger');
        return false;
    } else {
        return true;
    }
};