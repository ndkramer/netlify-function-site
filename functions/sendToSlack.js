exports.handler = async (event) => {
    const allowedOrigins = [
        "https://www.one80labs.com",
        "https://grapefruit-disc-eb44.squarespace.com"
    ];

    const origin = event.headers.origin;
    const isAllowed = allowedOrigins.includes(origin);

    // Handle preflight (OPTIONS) requests
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": isAllowed ? origin : "null",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    // Deny request if origin is not allowed
    if (!isAllowed) {
        return {
            statusCode: 403,
            headers: {
                "Access-Control-Allow-Origin": "null",
            },
            body: JSON.stringify({ message: "Origin not allowed" }),
        };
    }

    // Parse the form data from the request body
    let formData;
    try {
        formData = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": origin,
            },
            body: JSON.stringify({ message: "Invalid JSON data" }),
        };
    }

    // Extract fields
    const { email, contactPreference, courseName } = formData;

    if (!email || !contactPreference || !courseName) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": origin,
            },
            body: JSON.stringify({ message: "Missing required fields" }),
        };
    }

    // Log form data for debugging
    console.log("Form Data Received:", formData);

    // Simulate sending data to Slack or other service
    try {
        console.log(`Sending form data to Slack: ${JSON.stringify(formData)}`);
        // Simulate successful processing
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": origin,
            },
            body: JSON.stringify({ message: "Form submitted successfully" }),
        };
    } catch (error) {
        console.error("Error sending data to Slack:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": origin,
            },
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
