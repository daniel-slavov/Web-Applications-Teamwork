const search = () => {
    $('#search-btn').click(() => {
        let pattern = $('#pattern').val;
        if (pattern.length > 0) {
             let url = `/api/events/${pattern}`;

             requester.get(url)
                 .then(response => {
                     $('#results').html(response);
                 });
         }
    })
}