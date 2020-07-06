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

  let url = baseUrl + 'orders/' + atob(orderId);

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
      let date = new Date(data.date_created);
      date = date.toLocaleDateString("pt-PT",{year: 'numeric', month: 'numeric', day: 'numeric'});
      document.querySelector("#date").innerHTML = "(" + date + ")";
      document.querySelector("#product").innerHTML = data.line_items[0].name;
      document.querySelector("#quantity").innerHTML = "x " + data.line_items[0].quantity;
      document.querySelector("#subtotal").innerHTML = data.line_items[0].subtotal + "€";
      document.querySelector("#total").innerHTML = data.line_items[0].total + "€";
      document.querySelector("#shipping").innerHTML =
        data.shipping_total < 1 ? 'Grátis!' : data.shipping_total + "€";
      document.querySelector("#method").innerHTML = data.payment_method_title;
      document.querySelector("#order-total").innerHTML = data.total + "€";

      // Populate Discount section with data
      document.querySelector("#discount-total").innerHTML = data.discount_total + "€";
      document.querySelector("#coupon-button").href = masterStore;


      /**
       * Social media sharing implementation
       */

      // Popup specific for facebook since it's strange on a full page
      let width = 600, height = 600;
      let left = (window.innerWidth - width) / 2;
      let top = (window.innerHeight - height) / 2;
      let opts = 'width=' + width + ',height=' + height + ',top=' + top +',left=' + left;

      // Facebook
      document.querySelector("#share-fb").onclick = () => {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' +
                    shareUrl + '&quote=' + shareMsg, 'popup', opts);
        showCoupon()
      };

      // Pinterest
      document.querySelector("#share-pin").onclick = () => {
        window.open('http://pinterest.com/pin/create/button/?url=' +
                    shareUrl + '&media=' + pinImg + '&description=' + shareMsg);
        showCoupon()
      };

      // Watsapp
      document.querySelector("#share-wats").onclick = () => {
        let params = encodeURI(shareUrl);
        window.open('whatsapp://send?text=' + shareMsg + params);
        showCoupon()
      };

      // Facebook Massenger
      document.querySelector("#share-messenger").onclick = () => {
        window.open('fb-messenger://share/?link=' + shareUrl + '&quote=' + shareMsg);
        showCoupon()
      };

      // Telegram
      document.querySelector("#share-telegram").onclick = () => {
        window.open('https://t.me/share/url?url=' + shareUrl + '&text=' + shareMsg);
        showCoupon()
      };

      // Populate Shipping section with data
      document.querySelector("#first_name").innerHTML = data.billing.first_name;
      document.querySelector("#last_name").innerHTML = data.billing.last_name;
      document.querySelector("#address_1").innerHTML = data.billing.address_1;
      document.querySelector("#address_2").innerHTML = data.billing.address_2;
      document.querySelector("#postcode").innerHTML = data.billing.postcode;
      document.querySelector("#city").innerHTML = data.billing.city;
      document.querySelector("#country").innerHTML = data.billing.country;
      document.querySelector("#phone").innerHTML = data.billing.phone;
      document.querySelector("#email").innerHTML = data.billing.email;




      console.log("Document Ready State:", document.readyState)

      if (document.readyState === "complete") {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("main").style.visibility = "visible";
      }

    })
    .catch((error) => {
      console.log('Error', error);
    });










})();


const showCoupon = () => {
  document.querySelector("#discount-share").style.display = "none";
  document.querySelector("#discount-coupon").style.display = "block";

};
