const update = () => {
    $('#update-event-button').click(() => {
        for (var index = 0; index < 4; index+=1) {
            var editField = document.createElement('input');
            editField.setAttribute('type', 'text');
            editField.setAttribute('value', $('.data:eq(0)').text());
            $(`.data:eq(0)`).replaceWith(editField);
        };

        $('#delete-event-button').hide();
        $('#update-event-button').hide();        
        $('#cancel-event-button').removeClass('hidden');
        $('#confirm-event-button').removeClass('hidden');
    });

    $('#cancel-event-button').click(() => {
        location.reload();
    });

    $('#confirm-event-button').click(() => {
        let title = $('#title').text();
        // console.log(title);
        let url = `${document.location.origin}/api/events/${title}`;
        // console.log(url);
        var data = {
            place: $('.media:eq(0) > input').val(),
            date: $('.media:eq(1) > input').val(),
            time: $('.media:eq(2) > input').val(),
            details: $('.media:eq(4) > input').val()
        }

        // console.log(data);

        requester.put(url, data)
                 .then((response, textStatus, xhr) => {
                     console.log(`Response: ${xhr.status}`);
                     if (true) {
                        location.reload();
                     } else {
                        $('#details-box').after(response);
                     }
                 });
    });
};