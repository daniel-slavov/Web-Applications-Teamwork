const navigation = () => {
    $('#show-my-events-btn').click(() => {
        let url = `api/users/${user.username}/my-events`;
        console.log(url);

        requester.get(url)
                 .then(response => {
                     $('#my-events').html(response);
                 });
    });

};