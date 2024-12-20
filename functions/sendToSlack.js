import fetch from 'node-fetch';

export async function handler(event) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error("Slack webhook URL is missing");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Slack webhook URL is missing" }),
        };
    }

    try {
        const data = JSON.parse(event.body);
        const slackMessage = {
            text: `*New Form Submission:*\n- Email: ${data.email}\n- Contact Preference: ${data.contactPreference}\n- Course Name: ${data.courseName}`,
        };

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slackMessage),
        });

        if (!response.ok) {
            throw new Error(`Slack API error: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Message sent to Slack successfully!" }),
        };
    } catch (error) {
        console.error("Error sending message to Slack:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send message to Slack." }),
        };
    }
}
