const fetch = require('node-fetch'); // Use CommonJS syntax for Node.js environment

exports.handler = async function (event, context) {
    // URL of the target API
    const targetUrl = 'https://www.one80training.com/courses?format=json-pretty';

    try {
        console.log("Fetching data from target URL:", targetUrl); // Debugging

        // Fetch data from the target API
        const response = await fetch(targetUrl);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        console.log("Data fetched successfully:", data); // Debugging

        // Return the fetched data
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        // Log any errors
        console.error("Error in proxy function:", error);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
