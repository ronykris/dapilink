//const fetch = require('node-fetch'); // If you're using this in a Node.js environment

const apiUrl = 'https://serpapi.com/search';
const apiKey = process.env.API_KEY || '';

const queryParams = new URLSearchParams({
  engine: 'google',
  q: 'Coffee',
  api_key: apiKey,
});

const url = `${apiUrl}?${queryParams.toString()}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    // Handle the response data here
    console.log(data);
  })
  .catch(error => {
    // Handle any errors here
    console.error('Error:', error);
  });
