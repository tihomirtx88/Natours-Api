const React = require('react');
const ReactDOMServer = require('react-dom/server');
const WelcomeEmail = require('../views/email/WelcomeEmail').default || require('../views/email/WelcomeEmail');

// Function to render the JSX component to HTML
const renderWelcomeEmail = (firstName, url) => {
  const emailComponent = React.createElement(WelcomeEmail, { firstName, url });
  const html = ReactDOMServer.renderToStaticMarkup(emailComponent); 
  return `<!DOCTYPE html>${html}`; 
};

module.exports = renderWelcomeEmail;