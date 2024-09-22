const React = require('react');
const ReactDOMServer = require('react-dom/server');
const PasswordReset = require('../views/email/PasswordReset').default || require('../views/email/PasswordReset');

function renderPasswordResetEmail(firstName, url) {
  const html = ReactDOMServer.renderToStaticMarkup(
    <PasswordReset firstName={firstName} url={url} />
  );
  return html;
}

module.exports = renderPasswordResetEmail;