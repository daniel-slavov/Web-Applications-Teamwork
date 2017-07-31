const navigation = () => {
    $('#show-my-events-btn').click(() => {
        const username = $('#curent-user').html();
        // console.log(username);
        const url = `${document.location.origin}/api/users/${username}/events`;
        // console.log(url);

        $('#hide-my-events-btn').show();
        $('#show-my-events-btn').hide();

        requester.get(url)
                 .then((response) => {
                    //  console.log(response);
                     $('#user-events').html(response);
                 });
    });

    $('#hide-my-events-btn').click(() => {
        $('#hide-my-events-btn').hide();
        $('#show-my-events-btn').show();
        $('#user-events').empty();
    });

    $('.category-btn').click((event) => {
        const category = event.target.textContent;
        const url = `${document.location.origin}/api/categories/${category}`;
        // console.log(url);

        requester.get(url)
                .then((response) => {
                    $('.category-results').remove();
                    const $results = $("<div/>", {
                        class: 'category-results',
                    });
                    const $all = $("<a/>", {
                        type: 'button',
                        'data-toggle': 'tooltip',
                        'data-placement': 'right',
                        href: '/categories/' + category,
                        title: 'See all events in this category',
                        text: 'More from this category ...',
                        css: {
                            'font-size': '1.5em'
                        }
                    });
                    $results.append(response);
                    $results.append($all);
                    $(event.target).after($results);
                    
                });

    });

    $('#show-events-btn').click((event) => {
        const date = $('.ui-state-active').html();
        let month = '';

        switch ($('.ui-datepicker-month').html()) {
            case 'January':
                month = '01';
                break;
            case 'February':
                month = '02';
                break;
            case 'March':
                month = '03';
                break;
            case 'April':
                month = '04';
                break;
            case 'May':
                month = '05';
                break;
            case 'June':
                month = '06';
                break;
            case 'July':
                month = '07';
                break;
            case 'August':
                month = '08';
                break;
            case 'September':
                month = '09';
                break;
            case 'October':
                month = '10';
                break;
            case 'November':
                month = '11';
                break;
            case 'December':
                month = '12';
                break;
            default:
                break;
        }
        const year = $('.ui-datepicker-year').html();
        const url = `${document.location.origin}/api/events-calendar/${year}-${month}-${date}`;

        requester.get(url)
                .then((response) => {
                    $('.row').remove();
                    $('#show-events-btn').after(response);
                });
    });
};
