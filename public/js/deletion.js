const deletion = () => {
    $('#delete-event-button').click(() => {
        let title = $('#title').text();
        // console.log(title);
        let url = `${document.location.origin}/api/events/${title}`;
        // console.log(url);

        requester.delete(url)
                 .then((response) => {
                     location.href = response.redirect;
                 });
    });
};