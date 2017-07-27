const update = () => {
    $('#update-event-button').click(() => {
        for (let index = 0; index < 4; index+=1) {
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

    $('#change-avatar-btn').click(() => {

    });
};
