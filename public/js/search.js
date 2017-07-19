const search = () => {
    $('#search-btn').click(() => {
        let pattern = $('#pattern').val;
        console.log(url);

        if (pattern.length > 0) {
            let url = `/api/events/${pattern}`;
            // console.log(url);

             requester.get(url)
                 .then(response => {
                     $('#results').html(response);
                 });
         }
    })
};