const navigation = () => {
    $('#show-my-events-btn').click(() => {
        let username = $('#curent-user').html();
        // console.log(username);
        let url = `${document.location.origin}/api/users/${username}/events`;
        // console.log(url);

        requester.get(url)
                 .then(response => {
                    //  console.log(response);
                     $('#my-events').removeClass("hidden");
                     $('#event-items').html(response);
                 });
    });

    $('.category-btn').click((event) => {
        let category = event.target.innerHTML;
        // console.log(category);
        let url = `${document.location.origin}/api/categories/${category}`;
        // console.log(url);

        requester.get(url)
                .then(response => {
                    // console.log(response);
                    $(event.target).after(response);
                });
    });

    $('.ui-state-default').click((event) => {
        let date = event.target.innerHTML;
        // console.log(date);
        let url = `${document.location.origin}/api/events-calendar/${date}`;
        // console.log(url);

        requester.get(url)
                .then(response => {
                    // console.log(response);
                    $('#datepicker').after(response);
                })
    });
};