/**
 * main.js
 * Checkout that submits orders to ecommerce store
 */

(async () => {
  'use strict';

  /**
   * Reference the main form
   */

  // Create references to the main form and its submit button.
  const form = document.getElementById('payment-form');
  const submitButton = form.querySelector('button[type=submit]');


  /**
   * Display product information on the form
   */

  // Option One Card Display Text
  form.querySelector("#op-one > .left").innerHTML = `${op.one.displayBest} ${op.one.displayName} ${op.one.displayPromo}`;
  form.querySelector("#op-one > .right").innerHTML = `${op.one.displayPrice} ${op.one.displayShipping}`;

  // Option Two Card Display Text
  form.querySelector("#op-two > .left").innerHTML = `${op.two.displayBest} ${op.two.displayName} ${op.two.displayPromo}`;
  form.querySelector("#op-two > .right").innerHTML = `${op.two.displayPrice} ${op.two.displayShipping}`;

  // Option Three Card Display Text
  form.querySelector("#op-three > .left").innerHTML = `${op.three.displayBest} ${op.three.displayName} ${op.three.displayPromo}`;
  form.querySelector("#op-three > .right").innerHTML = `${op.three.displayPrice} ${op.three.displayShipping}`;

  // Option Four Card Display Text
  form.querySelector("#op-four > .left").innerHTML = `${op.four.displayBest} ${op.four.displayName} ${op.four.displayPromo}`;
  form.querySelector("#op-four > .right").innerHTML = `${op.four.displayPrice} ${op.four.displayShipping}`;

  // Option Five Card Display Text
  form.querySelector("#op-five > .left").innerHTML = `${op.five.displayBest} ${op.five.displayName} ${op.five.displayPromo}`;
  form.querySelector("#op-five > .right").innerHTML = `${op.five.displayPrice} ${op.five.displayShipping}`;


  /**
   * Setup Stripe Elements.
   */

  // Create an instance of Elements.
  const elements = stripe.elements();

  // Prepare the styles for Elements.
  const style = {
    base: {
      iconColor: '#666ee8',
      color: '#31325f',
      fontWeight: 400,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#666ee8',
      },
    },
  };


  /**
   * Implement a Stripe Card Element that matches the look-and-feel of the app.
   */

  // Create a Card Element and pass some custom styles to it.
  const card = elements.create('card', {style});

  // Mount the Card Element on the page.
  card.mount('#card-element');

  // Monitor change events on the Card Element to display any errors.
  card.on('change', ({error}) => {
    const cardErrors = document.getElementById('card-errors');
    if (error) {
      cardErrors.textContent = error.message;
      cardErrors.classList.add('visible');
    } else {
      cardErrors.classList.remove('visible');
    }
    // Re-enable the Pay button.
    submitButton.disabled = false;
  });


  /**
   * Handle the form submission.
   */

  // Listen to changes to the user-selected country.
  form
    .querySelector('select[name=country]')
    .addEventListener('change', event => {
      event.preventDefault();
      selectCountry(event.target.value);
    });

  // Submit handler for our payment form.
  form.addEventListener('submit', async event => {
    event.preventDefault();

    // Retrieve the selected product options from the form.
    let selection = form.querySelector('input[name=option]:checked').value;

    // Update product choice based on the users selection
    switch (selection) {
      case 'one':
        selection = op.one;
        console.log("Option one");
        break;
      case 'two':
        selection = op.two;
        console.log("Option two");
        break;
      case 'three':
        selection = op.three;
        console.log("Option three");
        break;
      case 'four':
        selection = op.four;
        console.log("Option four");
        break;
      case 'five':
        selection = op.five;
        console.log("Option five");
        break;
    };

    // Retrieve the user information from the form.
    const payment = form.querySelector('input[name=payment]:checked').value;
    const country = form.querySelector('select[name=country] option:checked')
        .value;
    const email = form.querySelector('input[name=email]').value;

    // Build a data Object to pass with the order to the Store
    let data = {
      payment_method: '',
      payment_method_title: '',
      status: 'pending',
      billing: {
        first_name: form.querySelector('input[name=first_name]').value,
        last_name: form.querySelector('input[name=last_name]').value,
        address_1: form.querySelector('input[name=address_1]').value,
        address_2: form.querySelector('input[name=address_2]').value,
        city: form.querySelector('input[name=city]').value,
        postcode: form.querySelector('input[name=postcode]').value,
        country: country,
        email: email,
        phone: form.querySelector('input[name=phone]').value
      },
      shipping: {
        first_name: form.querySelector('input[name=first_name]').value,
        last_name: form.querySelector('input[name=last_name]').value,
        address_1: form.querySelector('input[name=address_1]').value,
        address_2: form.querySelector('input[name=address_2]').value,
        city: form.querySelector('input[name=city]').value,
        postcode: form.querySelector('input[name=postcode]').value,
        country: country
      },
      line_items: [
          {
            product_id: selection.product_id,
            quantity: selection.quantity,
            total: selection.total
          }
        ]
    };

    // Update Payment Method and Payment Method Title based on User Selection
    let sourceId = "";
    switch (payment) {
      case 'card':
        data.payment_method = 'stripe';
        data.payment_method_title = 'Cartão de Débito ou Crédito';
        // Create Stripe Source, IF Success, submitOrder
        stripe
          .createSource(card, {
            type: 'card',
            owner: {
              email: data.email
            },
          })
          .then( result => {
            if (result.error) {
              // Inform the user if there was an error
              let errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
              console.log("Error: ", result.error.message);
            } else {
              // Send the source to the server
              sourceId = result.source.id;
              console.log("Success: New source ", sourceId);
              submitOrder(data, sourceId);
            }
          });
        break;
      case 'multibanco':
        data.payment_method = 'multibanco_gateway';
        data.payment_method_title = 'Referência Multibanco';
        // Call the submitOrder function with an null source
        submitOrder(data, sourceId);
        break;
      case 'cod':
        data.payment_method = 'cod';
        data.payment_method_title = 'Pagamento na Entrega';
        data.status = 'processing';
        // aqui posso meter o status em Em Processamento!!!
        // Call the submitOrder function with an null source
        submitOrder(data, sourceId);
        break;
    };

    // Disable the Pay button to prevent multiple click events.
    submitButton.disabled = true;
    submitButton.textContent = 'Processing…';
  });


  /**
   * Process the order.
   */

  // Send order to the server
  const submitOrder = (orderData, sourceId) => {
    // Prepare the request url
    let url = baseUrl + 'orders';

    let myHeaders = new Headers();
    myHeaders.append("Authorization", myAuth);
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(orderData),
      redirect: 'follow'
    };

    fetch(url, requestOptions)
      .then(response => {
        return response.json();
      })
      .then((data) => {
        console.log('New order created: ', data.id);

        // Prepare request urls for the next function call
        if (data.payment_method === 'multibanco_gateway') {

          url = baseUrl + 'multibanco_gateway';
          console.log("Enviado para:", url);
          // call the processPayment function
          processPayment(data.id, data.payment_method, sourceId, url)

        } else if (data.payment_method === 'stripe') {

          url = baseUrl + 'stripe_payment';
          console.log("Enviado para:", url)
          // call the processPayment function
          processPayment(data.id, data.payment_method, sourceId, url)

        } else {

          console.log("Processo concluído! (outros métodos de pagamento)")
        }

      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  // Instruct the store to process the payment
  const processPayment = (orderId, paymentMethod, sourceId, url) => {

    let myHeaders = new Headers();
    myHeaders.append("Authorization", myAuth);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({"order_id":orderId,"payment_method":paymentMethod,"payment_token":sourceId});

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => console.log('Payment status: ', result.message))
      .catch(error => console.log('Error', error));
  };


  /**
   * Display the relevant payment methods for a selected country.
   */

  // List of relevant countries for the payment methods supported in this demo.
  // Read the Stripe guide: https://stripe.com/payments/payment-methods-guide
  const paymentMethods = {
    card: {
      name: 'Card',
      flow: 'none',
    },
    multibanco: {
      name: 'Multibanco',
      flow: 'receiver',
      countries: ['PT'],
      currencies: ['eur'],
    },
    cod: {
      name: 'Envio à Cobrança',
      flow: 'none',
      countries: ['PT'],
      currencies: ['eur'],
    },
  };

  const selectCountry = country => {
    const selector = document.getElementById('country');
    selector.querySelector(`option[value=${country}]`).selected = 'selected';
    selector.className = `field ${country}`;

    // Trigger the methods to show relevant fields and payment methods on page load.
    showRelevantFormFields();
    showRelevantPaymentMethods();
  };

  // Show only form fields that are relevant to the selected country.
  const showRelevantFormFields = country => {
    if (!country) {
      country = form.querySelector('select[name=country] option:checked').value;
    }
    const zipLabel = form.querySelector('label.zip');
    // Only show the state input for the United States.
    zipLabel.parentElement.classList.toggle('with-state', country === 'US');
    // Update the ZIP label to make it more relevant for each country.
    form.querySelector('label.zip span').innerText =
      country === 'US' ? 'ZIP' : country === 'PT' ? 'Código Postal' : 'Postal Code';
  };

  // Show only the payment methods that are relevant to the selected country.
  const showRelevantPaymentMethods = country => {
    if (!country) {
      country = form.querySelector('select[name=country] option:checked').value;
    }
    const paymentInputs = form.querySelectorAll('input[name=payment]');
    for (let i = 0; i < paymentInputs.length; i++) {
      let input = paymentInputs[i];
      input.parentElement.classList.toggle(
        'visible',
        input.value === 'card' ||
          (suportedPaymentMethods.includes(input.value) &&
            paymentMethods[input.value].countries.includes(country) &&
            paymentMethods[input.value].currencies.includes(defaultCurrency))
      );
    }

    // Hide the tabs if card is the only available option.
    const paymentMethodsTabs = document.getElementById('payment-methods');
    paymentMethodsTabs.classList.toggle(
      'visible',
      paymentMethodsTabs.querySelectorAll('li.visible').length > 1
    );

    // Check the first payment option again.
    paymentInputs[0].checked = 'checked';
    form.querySelector('.payment-info.card').classList.add('visible');
    form.querySelector('.payment-info.cod').classList.remove('visible');
    form.querySelector('.payment-info.multibanco').classList.remove('visible');
    //updateButtonLabel(paymentInputs[0].value);
  };

  // Listen to changes to the payment method selector.
  for (let input of document.querySelectorAll('input[name=payment]')) {
    input.addEventListener('change', event => {
      event.preventDefault();
      const payment = form.querySelector('input[name=payment]:checked').value;
      const flow = paymentMethods[payment].flow;

      // Show the relevant details, whether it's an extra element or extra information for the user.
      form
        .querySelector('.payment-info.card')
        .classList.toggle('visible', payment === 'card');
      form
        .querySelector('.payment-info.cod')
        .classList.toggle('visible', payment === 'cod');
      form
        .querySelector('.payment-info.multibanco')
        .classList.toggle('visible', payment === 'multibanco');
      document
        .getElementById('card-errors')
        .classList.remove('visible', payment !== 'card');
    });
  }

  // Select the default country from the config on page load.
  let country = defaultCountry;
  // Override it if a valid country is passed as a URL parameter.
  // Example comming from the landing page with http://localhost:8000/?country=ES
  const urlParams = new URLSearchParams(window.location.search);
  let countryParam = urlParams.get('country')
    ? urlParams.get('country').toUpperCase()
    : country;
  if (form.querySelector(`option[value="${countryParam}"]`)) {
    country = countryParam;
  }
  selectCountry(country);


})();

