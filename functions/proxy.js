const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const targetUrl = 'https://www.one80training.com/courses';
    const offset = event.queryStringParameters?.offset || ''; // Fetch offset from query parameters, if provided

    try {
        // Construct the full URL with the offset
        const fetchUrl = `${targetUrl}${offset ? `?offset=${offset}` : ''}`;
        console.log(`Fetching from: ${fetchUrl}`); // Log the full URL

        // Fetch data from the target API
        const response = await fetch(fetchUrl);
        console.log("Response Headers:", response.headers.raw()); // Log response headers

        if (!response.ok) {
            const rawText = await response.text(); // Log raw response in case of an error
            console.error("Error response text:", rawText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Verify response content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const rawText = await response.text(); // Capture HTML response
            console.error("Unexpected content type:", contentType);
            console.error("Response content:", rawText);
            throw new Error("Invalid JSON response: received non-JSON content.");
        }

        const data = await response.json();
        console.log("Fetched data successfully:", data); // Log the fetched data

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(data), // Return the fetched data
        };
    } catch (error) {
        console.error("Error in proxy function:", error); // Log the error details

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: error.message }), // Return error message
        };
    }
};
