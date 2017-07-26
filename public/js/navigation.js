const navigation = () => {
    $('#show-my-events-btn').click(() => {
        let username = $('#curent-user').html();
        // console.log(username);
        let url = `${document.location.origin}/api/users/${username}/events`;
        // console.log(url);

        $('#hide-my-events-btn').show();
        $('#show-my-events-btn').hide();

        requester.get(url)
                 .then(response => {
                    //  console.log(response);
                     $('#hide-my-events-btn').after(response);
                 });       
    });

    $('#hide-my-events-btn').click(() => {
        $('#hide-my-events-btn').hide();
        $('#show-my-events-btn').show();
        $('.row').remove();
    });

    $('.category-btn').click((event) => {
        let category = event.target.innerHTML;
        // console.log(category);
        let url = `${document.location.origin}/api/categories/${category}`;
        // console.log(url);

        requester.get(url)
                .then(response => {
                    // console.log(response);
                    $('.row').remove();
                    $(event.target).after(response);
                });
    });

    $('.ui-datepicker-calendar').on ('click', '.ui-state-default', (event) => {
        console.log('works');
        if (event.target.hasClass('ui-state-default')) {
            let date = event.target.innerHTML;
            console.log(date);
            let url = `${document.location.origin}/api/events-calendar/${date}`;
            // console.log(url);

            requester.get(url)
                    .then(response => {
                        console.log(response);
                        $('.row').remove();
                        $('#datepicker').after(response);
                    })
        }
    });
};