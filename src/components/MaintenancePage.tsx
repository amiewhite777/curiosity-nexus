'use client';

import { MAINTENANCE_CONFIG } from '@/config/maintenance';

export default function MaintenancePage() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Logo/Title */}
        <h1 style={styles.title}>{MAINTENANCE_CONFIG.title}</h1>

        {/* Animated orb */}
        <div style={styles.orbContainer}>
          <div style={styles.orb}></div>
        </div>

        {/* Message */}
        <p style={styles.message}>{MAINTENANCE_CONFIG.message}</p>
        <p style={styles.submessage}>{MAINTENANCE_CONFIG.submessage}</p>

        {/* Estimated return time */}
        {MAINTENANCE_CONFIG.estimatedReturn && (
          <p style={styles.estimatedReturn}>
            Expected return: {MAINTENANCE_CONFIG.estimatedReturn}
          </p>
        )}

        {/* Animated dots */}
        <div style={styles.dots}>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes dot-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        .orb-pulse {
          animation: pulse 3s ease-in-out infinite;
        }

        .dot-1 {
          animation: dot-bounce 1.4s infinite ease-in-out;
          animation-delay: 0s;
        }

        .dot-2 {
          animation: dot-bounce 1.4s infinite ease-in-out;
          animation-delay: 0.2s;
        }

        .dot-3 {
          animation: dot-bounce 1.4s infinite ease-in-out;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '200',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '40px',
    letterSpacing: '2px',
  },
  orbContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  orb: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, rgba(150, 200, 255, 0.9), rgba(100, 150, 255, 0.6), rgba(80, 120, 200, 0.3))',
    boxShadow: '0 0 40px 10px rgba(100, 200, 255, 0.4)',
    animation: 'pulse 3s ease-in-out infinite',
  },
  message: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: '16px',
    lineHeight: '1.6',
    fontWeight: '300',
  },
  submessage: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '32px',
    lineHeight: '1.6',
    fontWeight: '300',
  },
  estimatedReturn: {
    fontSize: '14px',
    color: 'rgba(100, 200, 255, 0.8)',
    marginBottom: '32px',
    fontWeight: '400',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(100, 200, 255, 0.8)',
    display: 'inline-block',
  },
};
