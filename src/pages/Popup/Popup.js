import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [misMatch, setMisMatch] = useState(0);
  const [tabId, setTabId] = useState('');
  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        message: 'start',
        id: activeTab.id,
      });
      setTabId(activeTab.id);
    });
  }, []);

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message === 'data') {
      setMisMatch(request.data);
    }
  });

  return (
    <>
      <div className="App" style={{ color: 'white' }}>
        {misMatch > 0 ? (
          <>
            <h3>
              Your website may have been maliciously changed while you were
              somewhere else!
            </h3>
            <h3>You have a mismatch percentage of {misMatch}%!</h3>
            <h3>
              If you see any <h3 style={{ color: 'red' }}>red</h3> overlay on
              the screen after clicking away, this content has changed!
            </h3>
            <button
              style={{
                padding: '1rem',
                borderRadius: '0.25rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
              onClick={() => {
                chrome.tabs.sendMessage(tabId, { message: 'clear', id: tabId });
              }}
            >
              Click here to clear overlay.
            </button>
          </>
        ) : (
          <>
            <h3>No changes detected on your website since your last visit!</h3>
          </>
        )}
      </div>
    </>
  );
};
export default Popup;
