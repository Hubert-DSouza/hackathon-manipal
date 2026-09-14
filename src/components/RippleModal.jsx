import React from 'react';
import { calculateCascade } from '../lib/cascadeEngine';

const TYPE_HUMAN_LABELS = {
  road: 'Road',
  junction: 'Junction',
  drain: 'Drain',
  hospital: 'Hospital Access',
  bus_route: 'Bus Route',
  power_facility: 'Power Supply',
  waste_facility: 'Sanitation Facility',
  water_facility: 'Water Pipeline',
  environment: 'Green Cover'
};

export default function RippleModal({ nodeId, onClose }) {
  const cascade = calculateCascade(nodeId);
  const { startNode, affectedNodes, scenarios } = cascade;

  if (!startNode) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="report-header">
          <button className="back-btn" onClick={onClose}>×</button>
          <div className="header-titles">
            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: 800, color: '#112826' }}>What could this affect?</h1>
            <small style={{ color: '#0b7067', fontWeight: 600 }}>See how a local disruption could spread through connected infrastructure</small>
          </div>
        </div>

        {/* Origin Disruption Badge */}
        <div style={{
          background: '#fff3f3',
          border: '1px solid #ffcdd2',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: '#d32f2f', fontWeight: 800 }}>
            Disruption Reported Here
          </div>
          <h3 style={{ margin: '4px 0 2px', fontSize: '15px', color: '#b71c1c', fontWeight: 800 }}>{startNode.name}</h3>
          <p style={{ margin: 0, fontSize: '11px', color: '#5d4037' }}>{startNode.description}</p>
        </div>

        {/* What If Scenario Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#fff0f1',
            borderRadius: '16px',
            padding: '12px',
            textAlign: 'center',
            border: '1px solid #ffd5d8'
          }}>
            <small style={{ fontSize: '9px', textTransform: 'uppercase', color: '#e04750', fontWeight: 800 }}>If Nothing Changes</small>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#c62828', margin: '4px 0' }}>
              {scenarios.doNothingCount} potentially affected
            </div>
          </div>

          <div style={{
            background: '#e8f4f0',
            borderRadius: '16px',
            padding: '12px',
            textAlign: 'center',
            border: '1px solid #bde7dc'
          }}>
            <small style={{ fontSize: '9px', textTransform: 'uppercase', color: '#0b7067', fontWeight: 800 }}>If Fixed First</small>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#087267', margin: '4px 0' }}>
              {scenarios.fixFirstCount} potentially affected
            </div>
            <span style={{ fontSize: '9px', color: '#0b7067', fontWeight: 700 }}>
              Saves {scenarios.preventedImpactsCount} connected areas
            </span>
          </div>
        </div>

        {/* How It Could Spread Chain */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 12px', color: '#112826', fontWeight: 800 }}>How it could spread:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {affectedNodes.map((item, idx) => (
              <React.Fragment key={item.node.id}>
                {idx > 0 && (
                  <div style={{ textAlign: 'center', color: '#087267', fontSize: '14px', lineHeight: 1, margin: '-2px 0' }}>
                    ↓
                  </div>
                )}
                <div style={{
                  background: idx === 0 ? '#e0f2f1' : '#ffffff',
                  border: idx === 0 ? '1.5px solid #004d40' : '1px solid #e0ebe7',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      color: idx === 0 ? '#004d40' : '#087267',
                      background: idx === 0 ? '#b2dfdb' : '#e6f4f0',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      textTransform: 'uppercase'
                    }}>
                      {item.stepLabel}
                    </span>
                    <small style={{ fontSize: '9px', color: '#7a8582', fontWeight: 700 }}>
                      {TYPE_HUMAN_LABELS[item.node.type] || item.node.type}
                    </small>
                  </div>
                  <h4 style={{ margin: '6px 0 2px', fontSize: '13px', color: '#112826', fontWeight: 800 }}>{item.node.name}</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: '#596b68', lineHeight: '1.3' }}>{item.reason}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '20px',
            background: '#087267',
            color: 'white',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
