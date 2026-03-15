import React, { useEffect } from 'react';
import { useLoading, setGlobalLoadingHandlers } from '../utils/LoadingContext';

const GlobalLoader = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Set the global handlers so they can be used in api.js
  useEffect(() => {
    setGlobalLoadingHandlers(startLoading, stopLoading);
  }, [startLoading, stopLoading]);

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="loader-content">
        <div className="premium-spinner">
          <div className="inner-ring"></div>
          <div className="outer-ring"></div>
          <div className="pulse-core"></div>
        </div>
        <div className="loader-text">
          <h2>MediBot</h2>
          <p>Processing Securely...</p>
        </div>
      </div>
      <style>{`
        .global-loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          animation: fadeIn 0.3s ease-out;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .premium-spinner {
          position: relative;
          width: 100px;
          height: 100px;
        }

        .inner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top-color: #0ea5e9;
          border-bottom-color: #0ea5e9;
          border-radius: 50%;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
        }

        .outer-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          border: 2px solid transparent;
          border-left-color: #38bdf8;
          border-right-color: #38bdf8;
          border-radius: 50%;
          opacity: 0.5;
          animation: spin-reverse 2s linear infinite;
        }

        .pulse-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: #0ea5e9;
          border-radius: 50%;
          box-shadow: 0 0 20px #0ea5e9;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loader-text {
          text-align: center;
          animation: textFade 2s ease-in-out infinite;
        }

        .loader-text h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .loader-text p {
          margin: 8px 0 0;
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.7; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes textFade {
          0%, 100% { opacity: 0.7; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;
