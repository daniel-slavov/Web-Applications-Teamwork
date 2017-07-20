const requester = {
//   init() {
//     $.ajaxSetup({
//       headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//       }
//     });
//   },
  get(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        method: 'GET',
        success(response) {
          resolve(response);
        }
      });
    });
  },
  post(url, body) {
    const dataBody = {
      content: body
    };

    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        data: JSON.stringify(dataBody),
        contentType: 'application/json',
        method: 'POST',
        success(response) {
          resolve(response);
        }
      });
    });
  }
};