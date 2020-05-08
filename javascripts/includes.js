fetch("./partials/header.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("header").innerHTML = data;
  });

fetch("./partials/footer.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("footer").innerHTML = data;
  });

// Updates page title and meta description
document.querySelector("head title").innerHTML = metaTitle;
document.querySelector("head > meta[name=description]").content = metaTitle;


