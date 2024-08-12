// components/CookieConsent.js
import { useEffect, useState } from 'react';

const CookieConsent = () => {

const [consent, setConsent] = useState(false);

useEffect(() => {
  // Code inside useEffect runs only on the client side
  const consent = localStorage.getItem('cookieConsent') === 'true';
  setConsent(consent);
}, []);

const handleAccept = () => {
  localStorage.setItem('cookieConsent', 'true');
  setConsent(true);
};

if (consent === null) {
  // Render nothing while checking the consent status
  return null;
}

if (consent) return null;

  return (
    <div style={bannerStyle}>
      <p>We use cookies to improve your experience. By continuing, you agree to our use of cookies.</p>
      <button className="btn btn-primary"  onClick={handleAccept}>Accept</button>
    </div>
  );
};

const bannerStyle = {
  position: 'fixed',
  bottom: '0',
  left: '0',
  width: '100%',
  backgroundColor: '#000',
  color: '#fff',
  padding: '10px',
  textAlign: 'center',
};

export default CookieConsent;
