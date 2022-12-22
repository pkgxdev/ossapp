#!/usr/bin/env node

async function main() {

  const message = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `NEW BUILD FOR ${process.env.PLATFORM}  <${process.env.DOWNLOAD_URL}|download ${process.env.VERSION ? ('v'+process.env.VERSION) : ''}>`
        }
      }
    ]
  }
  const res = fetch(process.env.SLACK_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' }
  })
  if (res.ok) {
    const data = await res.json();
    console.log(data);
  }
}

main();