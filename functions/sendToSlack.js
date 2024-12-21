import fetch from 'node-fetch';

export async function handler(event) {
    try {
        // Allow only POST requests
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                headers: {
                    "Access-Control-Allow-Origin": "https://grapefruit-disc-eb44.squarespace.com", // Replace with your Squarespace URL
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                },
                body: JSON.stringify({ error: "Method Not Allowed" }),
            };
        }

        // Parse the incoming data
        const data = JSON.parse(event.body);

        // Validate the required fields
        if (!data.email || !data.contactPreference || !data.courseName) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "https://grapefruit-disc-eb44.squarespace.com", // Replace with your Squarespace URL
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                },
                body: JSON.stringify({ error: "Missing required fields" }),
            };
        }

        // Construct the Slack message
        const slackMessage = {
            text: `*New Form Submission:*\n- Email: ${data.email}\n- Contact Preference: ${data.contactPreference}\n- Course Name: ${data.courseName}`,
        };

        // Send the message to Slack
        const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackMessage),
        });

        if (!response.ok) {
            throw new Error(`Slack API error: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "https://grapefruit-disc-eb44.squarespace.com", // Replace with your Squarespace URL
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: JSON.stringify({ message: "Message sent to Slack successfully!" }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "https://grapefruit-disc-eb44.squarespace.com", // Replace with your Squarespace URL
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: JSON.stringify({ error: "Failed to send message to Slack." }),
        };
    }
}
