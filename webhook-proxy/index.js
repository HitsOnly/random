// Vercel serverless function - webhook proxy
// Deploy to Vercel for free: https://vercel.com

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { hwid, username } = req.body;

    // Validate input
    if (!hwid || !username) {
      return res.status(400).json({ error: 'Missing hwid or username' });
    }

    // Discord webhook URL (stored on server, not in client)
    const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1400995236670345348/1Cs3NgyVow5Ru8ZZsK2VCF6wb8dA-xYK6nNLdcQAD-aItMiS1bfZ8koLN5CyqSCbbRhd';

    // Create Discord embed
    const discordPayload = {
      content: '',
      embeds: [{
        title: '🔐 New HWID Request',
        description: 'A user is requesting HWID authorization',
        color: 16776960,
        fields: [
          {
            name: '👤 Username',
            value: username,
            inline: true
          },
          {
            name: '🆔 HWID',
            value: `\`${hwid}\``,
            inline: true
          }
        ],
        footer: {
          text: 'Wasteria HWID System'
        },
        timestamp: new Date().toISOString()
      }]
    };

    // Forward to Discord
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload)
    });

    if (response.ok) {
      console.log('HWID request forwarded to Discord successfully');
      return res.status(200).json({ success: true });
    } else {
      console.error('Failed to forward to Discord:', response.status);
      return res.status(500).json({ error: 'Failed to forward request' });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 