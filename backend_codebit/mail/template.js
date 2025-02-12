exports.contestEmail = (userName, contestName, contestLink) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>New Contest Notification</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
          
            <div class="message">Exciting New Contest: ${contestName}</div>
            <div class="body">
                <p>Dear ${userName},</p>
                <p>We are excited to announce a new contest: <strong>${contestName}</strong>!</p>
                <p>Don't miss out on this amazing opportunity to participate and win great prizes.</p>
                <p>Click the link below to join the contest:</p>
                <p><a href="${contestLink}" class="cta">Join the Contest</a></p>
                <p>We hope to see you there!</p>
            </div>
            <div class="support">If you have any questions or need help, feel free to contact us at <a href="mailto:sagar.2003kosi@gmail.com">sagar.2003kosi@gmail.com</a>.</div>
        </div>
    </body>
    
    </html>`;
  };
  