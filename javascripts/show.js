/**
 * show.js
 * Show order completed data.
 */

(async () => {
  'use strict';

  // Get order id from the url
  let queryString = new URL(window.location.href);
  let orderId = queryString.searchParams.get("id");
  console.log("Order completed:", orderId);


  /**
   * Fetch the order from the store.
   */

  let url = baseUrl + 'orders/' + atob(orderId);
  console.log("url", url)

  let myHeaders = new Headers();
  myHeaders.append("Authorization", myAuth);
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(url, requestOptions)
    .then(response => {
      return response.json();
    })
    .then((data) => {
      console.log('Data:', data);

//    let authors = data.results;
//    return authors.map(function(author) {
//     let li = createNode('li'),
//         img = createNode('img'),
//         span = createNode('span');
//     img.src = author.picture.medium;
//     span.innerHTML = `${author.name.first} ${author.name.last}`;
//     append(li, img);
//     append(li, span);
//     append(ul, li);
//   })

    })
    .catch((error) => {
      console.log('Error', error);
    });







})();
