const fetch = require('node-fetch'); // Use CommonJS syntax for Node.js environment

exports.handler = async function (event, context) {
    const targetUrl = 'https://www.one80training.com/courses?format=json-pretty';

    try {
        console.log("Fetching data from target URL:", targetUrl); // Debugging

        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data fetched successfully:", data); // Debugging

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error in proxy function:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
