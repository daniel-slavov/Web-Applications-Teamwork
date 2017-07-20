const search = () => {
    $('#search-button').click(() => {
        let pattern = $('#pattern').val;
        console.log(pattern);

        if (pattern.length > 0) {
            let url = `/api/events/${pattern}`;
            console.log(url);

             requester.get(url)
                 .then(response => {
                     $('#results').html(response);
                 });
         }
    })

    // document.getElementById('search-btn').addEventListener('click', function() {
    //     console.log('search button');
    // });
};