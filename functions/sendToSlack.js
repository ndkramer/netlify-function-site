import fetch from 'node-fetch';

export async function handler(event) {
    const webhookUrl = "https://hooks.slack.com/services/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";

    try {
        // Parse the incoming form data from the event body
        const data = JSON.parse(event.body);

        // Create the Slack message payload
        const slackMessage = {
            text: `*New Form Submission:*\n- Email: ${data.email}\n- Contact Preference: ${data.contactPreference}\n- Course Name: ${data.courseName}`,
        };

        // Send the message to the Slack webhook
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slackMessage),
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Slack API error: ${response.statusText}`);
        }

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Message sent to Slack successfully!" }),
        };
    } catch (error) {
        console.error("Error sending message to Slack:", error);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send message to Slack." }),
        };
    }
}
