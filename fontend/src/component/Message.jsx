import React, { useEffect, useState } from 'react';

const Message = ({ message, type = 'info' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-500 ease-in-out`}
    >
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Message;
