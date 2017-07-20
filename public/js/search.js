const search = () => {
    $('#search-button').click(() => {
        let pattern = $('#pattern').val();
        console.log(pattern);

        if (pattern.length > 0) {
            let url = `/api/events/search`;
            console.log(url);

             requester.get(url, { pattern: pattern })
                 .then(response => {
                     console.log(response);
                     $('#results').html(response);
                 });
         }
    });

    // document.getElementById('search-btn').addEventListener('click', function() {
    //     console.log('search button');
    // });
};