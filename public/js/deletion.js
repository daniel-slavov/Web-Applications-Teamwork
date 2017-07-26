const deletion = () => {
    $('#delete-event-button').click(() => {
        let title = $('#title').text();
        console.log(title);
        let url = `${document.location.origin}/api/events/${title}`;
        console.log('URL: ' + url);
=======
        if (confirm("Please confirm that you want to delete the event.")) {
            requester.delete(url)
                 .then(response => {
                     location.href = response.redirect;
>>>>>>> b6051c24690758f7e4a60740849c42b1fcdd5bd4
                 });
        }
    });
};