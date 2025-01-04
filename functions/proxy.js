const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const targetUrl = 'https://www.one80training.com/courses?format=json-pretty';

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Raw Response Data:", data); // Log raw response for debugging
        return {
            statusCode: 200,
            body: JSON.stringify(data), // Return raw response
        };
    } catch (error) {
        console.error("Error in proxy function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
