const update = () => {
    $('#update-event-button').click(() => {
        let title = $('#title').text();
        console.log(title);
        let url = `${document.location.origin}/api/events/${title}`;
        console.log(url);

        // console.log($('.data'));

        for (var index = 0; index < 5; index+=1) {
            console.log(index);
            console.log($(`.data:eq(0)`).text());
            if (index == 3) {
                var editField = document.createElement('select');
                editField.setAttribute('multiple', '');
                var option = document.createElement('option');
                option.innerHTML = 'test';
                editField.appendChild(option);
            } else {
                var editField = document.createElement('input');
                editField.setAttribute('type', 'text');
                editField.setAttribute('value', $('.data:eq(0)').text());
            }

            $(`.data:eq(0)`).replaceWith(editField);
        };

        // requester.update(url, data)
        //          .then(response => {
        //              console.log('Updated.');
        //          });
    });
};