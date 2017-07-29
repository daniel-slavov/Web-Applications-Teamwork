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
            });
    });
    $('#update-event-button').click(() => {
        for (let index = 0; index < 4; index += 1) {
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
        // console.log(title);
        const url = `${document.location.origin}/api/events/${title}`;
        // console.log(url);
        const data = {
            place: $('.media:eq(0) > input').val(),
            date: $('.media:eq(1) > input').val(),
            time: $('.media:eq(2) > input').val(),
            details: $('.media:eq(4) > input').val(),
        };

        requester.put(url, data)
            .then((response) => {
                //  console.log(`Response then`);
                location.reload();
            }, (err) => {
                //  console.log($('#details-box').parent().prev());
                $('.alert').remove();
                $('div.row:eq(0)').before(err.responseText);
            });
    });

    $('#change-avatar-btn').click((event) => {
        const $target = event.target;
        const username = $('#curent-user').text();
        const url = `/api/upload`;
        const postUrl = `/api/users/${username}/upload/avatar`;

        requester.get(url)
            .then((response) => {
                // $('.upload-avatar').html(response);
                $('#uploadForm').attr('action', postUrl);
            });
    });

    $('#change-event-photo-btn').click((event) => {
        const title = $('#title').text();
        const url = `/api/upload`;
        const postUrl = `/api/events/${title}/upload/photo`;

        requester.get(url)
            .then((response) => {
                //$('.upload-event-photo').html(response);
                $('#uploadForm').attr('action', postUrl);           
            });
    });

    $('#edit-profile-btn').click(() => {
        console.log('edit');

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
        console.log(username);
        const url = `${document.location.origin}/users/${username}`;
        console.log(url);

        const data = {
            firstName: $('.info:eq(0) > input').val(),
            lastName: $('.info:eq(1) > input').val(),
            email: $('.info:eq(2) > input').val(),
            age: $('.info:eq(3) > input').val()
        };

        requester.put(url, data)
            .then((response) => {
                //  console.log(`Response then`);
                location.reload();
            }, (err) => {
                //  console.log($('#details-box').parent().prev());
                $('.alert').remove();
                $('div.row:eq(0)').before(err.responseText);
            });
    });
};
