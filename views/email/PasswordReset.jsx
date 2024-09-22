import React from 'react';

export default function PasswordReset({ firstName, url }) {
    return (
        <html>
          <head>
            <meta name="viewport" content="width=device-width" />
            <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Password Reset</title>
            <style>{`
              body { background-color: #f6f6f6; font-family: sans-serif; }
              .container { max-width: 580px; margin: 0 auto; padding: 10px; }
              .btn { background-color: #55c57a; color: white; padding: 12px 25px; text-decoration: none; }
            `}</style>
          </head>
          <body>
            <div className="container">
              <p>Hi {firstName},</p>
              <p>Forgot your password? Submit a patch request with your new password and passwordConfirm to: {url}</p>
              <a href={url} target="_blank" className="btn">
                Reset your password
              </a>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
            </div>
          </body>
        </html>
      );
}
