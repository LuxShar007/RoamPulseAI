import React from 'react';
import { ExternalLink, X } from 'lucide-react';

function FigmaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38H19V28.5Z" fill="#0ACF83"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#1ABCFE"/>
      <path d="M0 28.5C0 23.2533 4.25329 19 9.5 19H19V38H9.5C4.25329 38 0 33.7467 0 28.5Z" fill="#A259FF"/>
      <path d="M0 9.5C0 4.25329 4.25329 0 9.5 0H19V19H9.5C4.25329 19 0 14.7467 0 9.5Z" fill="#F24E1E"/>
      <path d="M19 0H28.5C33.7467 0 38 4.25329 38 9.5C38 14.7467 33.7467 19 28.5 19H19V0Z" fill="#FF7262"/>
    </svg>
  );
}

export default function FigmaBrainstormModal({ onClose }) {
  const figmaUrl = "https://www.figma.com/design/8RbDA2X0xEqG5NJW0pQf11/RoamPulseAI?node-id=0-1&t=w7L1KqsOf1UQdOH9-1";
  const figmaEmbedUrl = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2F8RbDA2X0xEqG5NJW0pQf11%2FRoamPulseAI%3Fnode-id%3D0-1%26t%3Dw7L1KqsOf1UQdOH9-1";

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg-dark)', zIndex: 600, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '44px 20px 14px 20px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F24E1E 0%, #A259FF 100%)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FigmaIcon size={18} />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#F24E1E', fontWeight: '800', letterSpacing: '0.5px' }}>FIGMA BRAINSTORM PROTOTYPE</div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>RoamPulse AI Scratch Canvas</h3>
          </div>
        </div>

        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={22} />
        </button>
      </div>

      {/* Embedded Live Figma Canvas Frame */}
      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative', background: '#1E1E1E' }}>
        <iframe
          title="RoamPulse AI Figma Brainstorm Prototype"
          src={figmaEmbedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
        />
      </div>

      {/* Bottom Action Footer */}
      <div style={{
        padding: '16px 20px 24px 20px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          View full scratch brainstorm node canvas on Figma
        </span>

        <a
          href={figmaUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F24E1E 0%, #A259FF 100%)',
            color: '#FFF',
            fontWeight: '800',
            fontSize: '13px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Open in Figma</span>
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
