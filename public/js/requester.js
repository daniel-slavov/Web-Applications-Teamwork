const requester = {
  get(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        method: 'GET',
        success(response) {
          resolve(response);
        },
      });
    });
  },
  post(url, body) {
    const dataBody = {
      content: body,
    };

    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        data: JSON.stringify(dataBody),
        contentType: 'application/json',
        method: 'POST',
        success(response) {
          resolve(response);
        },
      });
    });
  },
  put(url,data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            method: 'PUT',
            data: `place=${data.place}&date=${data.date}&time=${data.time}&details=${data.details}`,
            success(response) {
                console.log('here be dragons', response);
                resolve(response);
            },
            error(err)
            {
                reject(err);
            }
        });
    });
  },
  delete(url) {
    return new Promise((resolve,reject) => {
        $.ajax({
            url,
            method: 'DELETE',
            success(response) {
                resolve(response);
            }
        });
    });
  },
  putJSON(url, body, options = {}) {
    const promise = new Promise((resolve, reject) => {
      const headers = options.headers || {};
      $.ajax({
        url,
        headers,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: (response) => {
          resolve(response);
        },
      });
    });
    return promise;
  },
};
