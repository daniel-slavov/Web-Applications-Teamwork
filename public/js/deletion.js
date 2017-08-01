const deletion = () => {
    $('#delete-event-button').click(() => {
        const title = $('#title').text();
        const url = `${document.location.origin}/api/events/${title}`;

        if (confirm('Please confirm that you want to delete the event.')) {
            requester.delete(url)
                 .then((response) => {
                     location.href = '/';
                 });
        }
    });
};
