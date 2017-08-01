const update = () => {
    $('.glyphicon-thumbs-up').click(() => {
        const likes = $('#likes').text();
        const title = $('#title').text();
        const data = {
            title: title,
            votes: likes,
        };
        const url = `${document.location.origin}/api/events/${title}/upvote`;
        requester.put(url, data)
            .then((response) => {
                $('#likes').text(' ' + response.votes + ' ');
                $('.glyphicon-thumbs-up').remove();
            });
    });
    $('#update-event-button').click(() => {
        for (let index = 1; index <= 4; index += 1) {
            const editField = document.createElement('input');
            editField.setAttribute('type', 'text');
            editField.setAttribute('value', $('.data:eq(0)').text());
            $(`.data:eq(0)`).replaceWith(editField);
        }

        $('#delete-event-button').hide();
        $('#update-event-button').hide();
        $('#cancel-event-button').removeClass('hidden');
        $('#confirm-event-button').removeClass('hidden');
    });

    $('#cancel-event-button').click(() => {
        location.reload();
    });

    $('#confirm-event-button').click(() => {
        const title = $('#title').text();
        const url = `${document.location.origin}/api/events/${title}`;
        const data = {
            place: $('.media:eq(1) > input').val(),
            date: $('.media:eq(2) > input').val(),
            time: $('.media:eq(3) > input').val(),
            details: $('.media:eq(5) > input').val(),
        };

        if (validateEventUpdate(data)) {
            requester.put(url, data)
                .then((response) => {
                    location.reload();
                }, (err) => {
                    $('.alert').remove();
                    $('div.row:eq(0)').before(err.responseText);
                });
        }
    });

    $('#change-avatar-btn').click((event) => {
        const $target = event.target;
        const username = $('#curent-user').text();
        const url = `/api/upload`;
        const postUrl = `/api/users/${username}/upload/avatar`;

        requester.get(url)
            .then((response) => {
                $('#uploadForm').attr('action', postUrl);
            });
    });

    $('#change-event-photo-btn').click((event) => {
        const title = $('#title').text();
        const url = `/api/upload`;
        const postUrl = `/api/events/${title}/upload/photo`;

        requester.get(url)
            .then((response) => {
                $('#uploadForm').attr('action', postUrl);           
            });
    });

    $('#edit-profile-btn').click(() => {
        for (let index = 0; index < 4; index += 1) {
            const editField = document.createElement('input');
            editField.setAttribute('type', 'text');
            editField.setAttribute('value', $('.data:eq(0)').text());
            $(`.data:eq(0)`).replaceWith(editField);
        }

        $('#edit-profile-btn').hide();
        $('#show-my-events-btn').hide();
        $('#hide-my-events-btn').hide();
        $('#cancel-profile-btn').show();
        $('#confirm-profile-btn').show();
    });

    $('#cancel-profile-btn').click(() => {
        location.reload();
    });

    $('#confirm-profile-btn').click(() => {
        const username = $('#curent-user').text();
        const url = `${document.location.origin}/users/${username}`;
        const data = {
            firstName: $('.info:eq(0) > input').val(),
            lastName: $('.info:eq(1) > input').val(),
            email: $('.info:eq(2) > input').val(),
            age: $('.info:eq(3) > input').val()
        };

        if (validateUserUpdate(data)) {
            requester.put(url, data)
                .then((response) => {
                    location.reload();
                }, (err) => {
                    $('.alert').remove();
                    $('div.row:eq(0)').before(err.responseText);
                });
        }
    });
};
