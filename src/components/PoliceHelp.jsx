import React from 'react';
import { ArrowLeft, Phone } from 'lucide-react';

export default function PoliceHelp({ onBack }) {
  const callPolice = () => {
    window.location.href = 'tel:100';
  };

  const callEmergency = () => {
    window.location.href = 'tel:112';
  };

  const findPoliceStation = () => {
    window.open(
      'https://www.google.com/maps/search/police+station',
      '_blank'
    );
  };

  return (
    <div
      id="app-viewport"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '45px 20px 20px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <h2
            style={{
              margin: 0,
              color: 'var(--text-primary)',
              fontSize: '20px',
              fontWeight: '800',
            }}
          >
            Police Assistance
          </h2>

          <p
            style={{
              margin: '4px 0 0',
              color: 'var(--text-secondary)',
              fontSize: '12px',
            }}
          >
            Quick access to police assistance
          </p>
        </div>
      </div>

      {/* Options */}
      <div
        className="screen-content"
        style={{
          padding: '0 20px 24px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >

          {/* Call Police */}
          <div
            className="glass-card"
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: '800',
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                }}
              >
                Call Police
              </div>

              <div
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                Police assistance • 100
              </div>
            </div>

            <button
              onClick={callPolice}
              aria-label="Call Police"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'var(--accent-primary)',
                color: 'white',
              }}
            >
              <Phone size={20} />
            </button>
          </div>

          {/* Emergency */}
          <div
            className="glass-card"
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: '800',
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                }}
              >
                Emergency
              </div>

              <div
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                National emergency • 112
              </div>
            </div>

            <button
              onClick={callEmergency}
              aria-label="Call Emergency"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'var(--accent-primary)',
                color: 'white',
              }}
            >
              <Phone size={20} />
            </button>
          </div>

          {/* Find Nearby Police Station */}
          <div
            className="glass-card"
            onClick={findPoliceStation}
            style={{
              padding: '18px 20px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                fontWeight: '800',
                fontSize: '16px',
                color: 'var(--text-primary)',
              }}
            >
              Find Nearby Police Station
            </div>

            <div
              style={{
                marginTop: '6px',
                fontSize: '13px',
                lineHeight: '1.5',
                color: 'var(--text-secondary)',
              }}
            >
              Find police stations near you using Maps
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}