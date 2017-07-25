const search = () => {
    $('#search-btn').click(() => {
        let pattern = $('#pattern').val();
        let searchOption = $('input[name="searchOption"]:checked').val();
        $('.search-results').empty();

        if (pattern.length > 0) {
            let url = `/api/${searchOption}/search?name=${pattern}&isPartial=true`;
            console.log(url);

             requester.get(url)
                 .then(response => {
                     console.log(response);
                     $('.search-results').html(response);
                     window.history.pushState('Search', 'Title', `/api/${searchOption}/search?title=${pattern}`);
                 });
         }
    });
};