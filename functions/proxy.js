
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const targetUrl = 'https://www.one80training.com/courses';
    const offset = event.queryStringParameters?.offset || ''; // Fetch offset from query parameters, if provided

    try {
        const fetchUrl = `${targetUrl}${offset ? `?offset=${offset}` : ''}`;
        console.log(`Fetching from: ${fetchUrl}`);

        const response = await fetch(fetchUrl);
        console.log("Response Headers:", response.headers.raw());

        if (!response.ok) {
            const rawText = await response.text();
            console.error("Error response text:", rawText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const rawText = await response.text();
            console.error("Unexpected content type:", contentType);
            console.error("Response content (non-JSON):", rawText); // Log unexpected content
            throw new Error("Invalid JSON response: received non-JSON content.");
        }

        const data = await response.json();
        console.log("Fetched data successfully:", data);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error in proxy function:", error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
