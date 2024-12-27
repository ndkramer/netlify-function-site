const axios = require("axios"); // Ensure axios is installed

exports.handler = async (event) => {
    const allowedOrigins = [
        "https://www.one80training.com", // New domain
        "https://one80training.com",     // New domain without www
        "https://grapefruit-disc-eb44.squarespace.com" // Squarespace domain (if still relevant)
    ];

    const origin = event.headers.origin;
    const isAllowed = allowedOrigins.includes(origin);

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

    if (!isAllowed) {
        return {
            statusCode: 403,
            headers: {
                "Access-Control-Allow-Origin": "null",
            },
            body: JSON.stringify({ message: "Origin not allowed" }),
        };
    }

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

    const { firstName, lastName, email, course, message } = formData;

    // Validate required fields
    if (!firstName || !lastName || !email || !course) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": origin,
            },
            body: JSON.stringify({ message: "Missing required fields" }),
        };
    }

    const slackMessage = {
        text: `New course request:\n- Name: ${firstName} ${lastName}\n- Email: ${email}\n- Course: ${course}\n- Message: ${message || "No message provided"}`,
    };

    try {
        // Access the Slack webhook URL from Netlify environment variables
        const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

        if (!slackWebhookUrl) {
            throw new Error("Slack webhook URL is not configured in environment variables.");
        }

        const response = await axios.post(slackWebhookUrl, slackMessage);
        console.log("Slack response:", response.data);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": origin,
            },
            body: JSON.stringify({ message: "Form submitted successfully and sent to Slack." }),
        };
    } catch (error) {
        console.error("Error sending message to Slack:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": origin,
            },
            body: JSON.stringify({ message: "Failed to send message to Slack." }),
        };
    }
};
