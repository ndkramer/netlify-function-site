const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const targetUrl = 'https://www.one80training.com/courses?format=json-pretty';

    try {
        console.log("Fetching data from target URL:", targetUrl); // Log the target URL

        // Fetch data from the target API
        const response = await fetch(targetUrl);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        console.log("Data fetched successfully:", data); // Log raw response data

        // Return the fetched data with CORS headers
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error in proxy function:", error); // Log the error details

        // Return an error response with CORS headers
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
