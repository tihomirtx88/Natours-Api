import React from 'react';

const WelcomeEmail = ({ firstName, url }) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Welcome to Natours Family</title>
      <style>{`
        body { background-color: #f6f6f6; font-family: sans-serif; }
        .container { max-width: 580px; margin: 0 auto; padding: 10px; }
        .btn { background-color: #55c57a; color: white; padding: 12px 25px; text-decoration: none; }
      `}</style>
    </head>
    <body>
      <div className="container">
        <p>Hi {firstName},</p>
        <p>Welcome to Natours, we're glad to have you 🎉🙏</p>
        <p>Make sure to upload your user photo so we get to know you better!</p>
        <a href={url} target="_blank" className="btn">
          Upload your user photo
        </a>
        <p>If you need help booking your next tour, feel free to contact us!</p>
      </div>
    </body>
  </html>
);

export default WelcomeEmail;
