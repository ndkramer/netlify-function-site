const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // Extract the URL parameters
    const baseUrl = "https://www.one80training.com/courses?format=json-pretty";
    const { queryStringParameters } = event;

    // Append any query parameters for pagination or filtering
    const queryParams = new URLSearchParams(queryStringParameters).toString();
    const targetUrl = `${baseUrl}&${queryParams}`;

    // Fetch data from Squarespace
    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from Squarespace: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the data to the client
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
