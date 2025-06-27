import React from 'react';

const Toast = ({ message, type }) => {
  const bg = type === 'success' ? 'green' : 'red';

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      background: bg,
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: 9999,
    }}>
      {message}
    </div>
  );
};

export default Toast;
