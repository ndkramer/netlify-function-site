const fetch = require("node-fetch");

exports.handler = async (event) => {
    const webhookUrl = "https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXX";

    try {
        // Parse incoming form data
        const data = JSON.parse(event.body);

        // Create Slack message
        const slackMessage = {
            text: `*New Form Submission:*\n- Email: ${data.email}\n- Contact Preference: ${data.contactPreference}\n- Course Name: ${data.courseName}`,
        };

        // Send to Slack
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slackMessage),
        });

        // Check response
        if (!response.ok) {
            throw new Error(`Slack API error: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Message sent to Slack successfully!" }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send message to Slack." }),
        };
    }
};
