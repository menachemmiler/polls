import React from "react";

const Loading: React.FC = () => {
  return (
    <div >
      <span className="loader" />
      <style>{`
        .loader {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-block;
          border-top: 4px solid #FFF;
          border-right: 4px solid transparent;
          box-sizing: border-box;
          position: relative;
          animation: rotation 1s linear infinite, colorCycle 4s linear infinite;
        }

        .loader::after {
          content: '';
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border-left: 4px solid #FF3D00;
          border-bottom: 4px solid transparent;
          animation: rotation 0.5s linear infinite reverse, colorCycle 4s linear infinite;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes colorCycle {
          0%, 100% {
            border-color: #ef4444 transparent transparent transparent;
          }
          25% {
            border-color: #eab308 transparent transparent transparent;
          }
          50% {
            border-color: #22c55e transparent transparent transparent;
          }
          75% {
            border-color: #3b82f6 transparent transparent transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
