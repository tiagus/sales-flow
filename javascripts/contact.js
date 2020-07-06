/**
 * contact.js
 * Serves to handle the contact form on the contact-us page
 */

(async () => {
  'use strict';

  /**
   * Reference the main form
   */

  // Create references to the main form and its submit button.
  const form = document.getElementById('contact-form');
  const submitButton = form.querySelector('button[type=submit]');


  /**
   * Handle the form submission.
   */

  // Submit handler for our payment form.
  form.addEventListener('submit', async event => {
    event.preventDefault();

    // Build a data Object to pass with the form submission
    let data = {
      "to": {
        "name": companyName, // My company
        "email": supportEmail // My support email
      },
      "from": {
        "name": "Contact Form",
        "email": supportEmail // My support email
      },
      "reply_to": {
        "name": form.querySelector('input[id=contactName]').value, // Person name
        "email": form.querySelector('input[id=contactEmail]').value // Person email
      },
      "subject": form.querySelector('input[id=contactSubject]').value,
      "content": {
        "type": "text/html",
        "value": form.querySelector('textarea[id=contactMessage]').value
      }
    };

    // Call the send mail function
    sendMail(JSON.stringify(data))

    // Disable the Pay button to prevent multiple click events.
    submitButton.disabled = true;
    submitButton.textContent = 'Processing…';
  });


  /**
   * Process the email sending
   */

  // Send email to sendgrid vis zapier
  const sendMail = (data) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow'
    };

    fetch(sendMaillUrl, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          document.querySelector("#send-button").style.display = "none";
          document.querySelector("#send-success").style.display = "block";
          document.querySelector("#send-success").innerHTML = "A sua mensagem foi enviada com sucesso.";
        }
      })
      .catch(error => {
        document.querySelector("#send-button").style.display = "none";
        document.querySelector("#send-failure").style.display = "block";
        document.querySelector("#send-failure").innerHTML = "O envio falhou, por favor tente outra vez.";
      })

  };

})();

