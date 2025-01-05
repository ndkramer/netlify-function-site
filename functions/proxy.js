const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const baseUrl = 'https://www.one80training.com/courses';
    let allData = [];
    let nextPageUrl = baseUrl;
    let iteration = 0; // Limit iterations to prevent infinite loops

    try {
        console.log("Fetching data from:", nextPageUrl); // Debugging

        while (nextPageUrl && iteration < 20) { // Pagination loop with a maximum of 20 iterations
            const response = await fetch(nextPageUrl);

            // Log response headers for debugging
            console.log("Response Headers:", response.headers.raw());

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Verify JSON response
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error("Invalid JSON response: received non-JSON content.");
            }

            const data = await response.json();

            // Append items to the allData array
            if (data.items && Array.isArray(data.items)) {
                allData = allData.concat(data.items);
            }

            // Check for nextPageUrl
            nextPageUrl = data.pagination?.nextPageUrl
                ? `${baseUrl}${data.pagination.nextPageUrl}`
                : null;

            console.log(`Fetched ${data.items?.length || 0} items from: ${nextPageUrl}`);
            iteration++;
        }

        console.log(`Total items fetched: ${allData.length}`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ items: allData }), // Return all fetched data
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
