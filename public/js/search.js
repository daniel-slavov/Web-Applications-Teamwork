const search = () => {
    $('#search-btn').click(() => {
        const pattern = $('#pattern').val();
        const searchOption = $('input[name="searchOption"]:checked').val();
        $('.search-results').empty();

        if (pattern.length > 0) {
            const url = `/api/${searchOption}/search?name=${pattern}&isPartial=true`;
            // console.log(url);

             requester.get(url)
                 .then((response) => {
                    //  console.log(response);
                     $('.search-results').html(response);
                     window.history.pushState('Search', 'Title', `/api/${searchOption}/search?name=${pattern}`);
                 });
         }
    });
};
