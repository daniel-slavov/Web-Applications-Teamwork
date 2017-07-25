const navigation = () => {
    $('btn-success').click(() => {
        let url = '/users/' + user.username + '/my-events';
        console.log(url);

        requester.get(url)
                 .then(response => {
                     $('#my-events').html(response);
                 });
    });

};