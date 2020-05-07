/**
 * show.js
 * Show order completed data.
 */

(async () => {
  'use strict';

  // Wait before we get the order data from the store before rendering the main content
  document.querySelector("main").style.visibility = "hidden";
  document.querySelector("#loader").style.visibility = "visible";

  // Get order id from the url
  let queryString = new URL(window.location.href);
  let orderId = queryString.searchParams.get("id");
  console.log("Order completed:", orderId);


  /**
   * Fetch the order from the store.
   */

  let url = baseUrl + 'orders/' + 14679; //atob(orderId);

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

      // Populate main head fields with data
      document.querySelector("#firsName").innerHTML = data.billing.first_name;
      document.querySelector("#orderNumber").innerHTML = data.id;
      document.querySelector("#email").innerHTML = data.billing.email;

      // Show multibanco section if needed and the correspondign data
      if (data.payment_method === "multibanco_gateway") {
        //document.querySelector("#multibanco").style.visibility = "visible";
        document.querySelector("#multibanco").style.display = "block";

        // Get Entity, Reference and Value
        let mbEnt = "";
        let mbRef = "";
        let mbVal = "";
        data.meta_data.forEach( item => {
          if (item.key === "woo-multibanco-gateway-stripe-multibanco-entity") {
            mbEnt = item.value;
          } else if (item.key === "woo-multibanco-gateway-stripe-multibanco-reference") {
            mbRef = item.value;
          } else if (item.key === "woo-multibanco-gateway-stripe-multibanco-valor") {
            mbVal = item.value;
          };
        });
        // Populate multibanco section with data
        document.querySelector("#mb-ent").innerHTML = mbEnt;
        document.querySelector("#mb-ref").innerHTML = mbRef;
        document.querySelector("#mb-val").innerHTML = mbVal + "€";
      };

      // Populate order section with data
      document.querySelector("#date").innerHTML = "(" + data.date_created + ")";
      document.querySelector("#product").innerHTML = data.line_items[0].name;
      document.querySelector("#quantity").innerHTML = "x " + data.line_items[0].quantity;
      document.querySelector("#subtotal").innerHTML = data.line_items[0].subtotal + "€";
      document.querySelector("#total").innerHTML = data.line_items[0].total + "€";
      document.querySelector("#shipping").innerHTML = data.shipping_total + "€";
      document.querySelector("#method").innerHTML = data.payment_method_title;
      document.querySelector("#order-total").innerHTML = data.total + "€";

      // Populate last section with data
      document.querySelector("#discount").innerHTML = data.discount_total + "€";
      document.querySelector("#coupon-button").href = masterStore;

      console.log("Document Ready State:", document.readyState)

      if (document.readyState === "complete") {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("main").style.visibility = "visible";
      }

    })
    .catch((error) => {
      console.log('Error', error);
    });







$(document).ready(function() {

      var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = 'https://www.googl.com',
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

$("#btn_shareFB").click(function() {
         window.open(       'https://www.facebook.com/sharer/sharer.php?u='+url,
        'facebook-share-dialog',
        opts);
        showCoupon()
});
$("#btn_shareTWI").click(function() {
         window.open(       'https://twitter.com/share?text=Share%20with%20twitter%20is%20so%20easy',
        'twitter-sahre-dialog',
        opts);
         showCoupon()
});

});










})();


const showCoupon = () => {
  document.querySelector("#last-share").style.display = "none";
  document.querySelector("#last-coupon").style.display = "block";

};
