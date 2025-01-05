const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const baseUrl = 'https://www.one80training.com/courses?format=json-pretty';

    try {
        console.log("Starting data fetch from API...");

        let allItems = [];
        let nextPageUrl = baseUrl;

        // Fetch all pages of data
        while (nextPageUrl) {
            console.log("Fetching page from:", nextPageUrl);

            const response = await fetch(nextPageUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            console.log("Page data fetched successfully:", data);

            // Validate and concatenate data
            if (data.items && Array.isArray(data.items)) {
                allItems = allItems.concat(data.items);
            } else {
                throw new Error("Invalid data format: 'items' not found or not an array");
            }

            // Update nextPageUrl for pagination
            nextPageUrl = data.pagination && data.pagination.nextPageUrl
                ? `https://www.one80training.com${data.pagination.nextPageUrl}`
                : null;
        }

        console.log(`Total items fetched: ${allItems.length}`);

        // Return all items with CORS headers
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ items: allItems }),
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
