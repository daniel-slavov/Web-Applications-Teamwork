const navigation = () => {
    $('#show-my-events-btn').click(() => {
        let username = $('#curent-user').html();
        console.log(username);
        let url = `${document.location.origin}/api/users/${username}/events`;
        console.log(url);

        requester.get(url)
                 .then(response => {
                     console.log(response);
                     $('#my-events').removeClass("hidden");
                     $('#event-items').html(response);
                 });
    });


};