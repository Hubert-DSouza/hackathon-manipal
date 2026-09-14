import React, { useState } from 'react';
import { MUMBAI_NODES, MUMBAI_EDGES } from '../lib/infrastructureData';
import { calculateCascade } from '../lib/cascadeEngine';
import RippleModal from './RippleModal';

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

export default function RippleView() {
  const [selectedNodeId, setSelectedNodeId] = useState(MUMBAI_NODES[0].id);
  const [modalNodeId, setModalNodeId] = useState(null);

  const selectedCascade = calculateCascade(selectedNodeId);

  return (
    <div className="ripple-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 0 30px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #073b35 0%, #087267 100%)',
        borderRadius: '24px',
        padding: '20px',
        color: '#ffffff',
        boxShadow: '0 6px 20px rgba(8, 114, 103, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            SociTea Ripple
          </span>
        </div>
        <h2 style={{ fontSize: '20px', margin: '0 0 6px', fontWeight: 800, letterSpacing: '-0.3px' }}>
          What could this affect?
        </h2>
        <p style={{ margin: 0, fontSize: '11px', opacity: 0.9, lineHeight: 1.4 }}>
          See how a local disruption could spread through connected Mumbai infrastructure.
        </p>
      </div>

      {/* Asset Picker Carousel */}
      <div>
        <h3 style={{ fontSize: '13px', margin: '0 0 10px', color: '#112826', fontWeight: 800 }}>Select Area or Infrastructure:</h3>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
          {MUMBAI_NODES.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  flex: '0 0 auto',
                  padding: '8px 14px',
                  borderRadius: '18px',
                  border: isSelected ? '2px solid #087267' : '1px solid #e0ebe7',
                  background: isSelected ? '#087267' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#435552',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {node.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Infrastructure Ripple Summary Card */}
      {selectedCascade.startNode && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(19,48,47,0.06)',
          border: '1px solid #edf2f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '9px', background: '#e6f4f0', color: '#0b7067', fontWeight: 800, padding: '3px 8px', borderRadius: '10px' }}>
              {TYPE_HUMAN_LABELS[selectedCascade.startNode.type] || selectedCascade.startNode.type}
            </span>
          </div>

          <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#112826', fontWeight: 800 }}>
            {selectedCascade.startNode.name}
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: '11px', color: '#596b68' }}>
            {selectedCascade.startNode.description}
          </p>

          {/* Scenario Comparison Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            <div style={{ background: '#fff0f1', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#e04750', fontWeight: 800 }}>If Nothing Changes</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#c62828' }}>
                {selectedCascade.scenarios.doNothingCount} potentially affected
              </div>
            </div>

            <div style={{ background: '#e8f4f0', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#0b7067', fontWeight: 800 }}>If Fixed First</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#087267' }}>
                {selectedCascade.scenarios.fixFirstCount} potentially affected
              </div>
            </div>
          </div>

          <button
            onClick={() => setModalNodeId(selectedNodeId)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '16px',
              background: '#087267',
              color: 'white',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            See how it could spread →
          </button>
        </div>
      )}

      {/* Network Connections */}
      <div>
        <h3 style={{ fontSize: '13px', margin: '10px 0 8px', color: '#112826', fontWeight: 800 }}>Connected Infrastructure Map:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {MUMBAI_EDGES.map((edge) => {
            const sourceNode = MUMBAI_NODES.find(n => n.id === edge.source_node_id);
            const targetNode = MUMBAI_NODES.find(n => n.id === edge.target_node_id);

            return (
              <div
                key={edge.id}
                onClick={() => setModalNodeId(edge.source_node_id)}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  border: '1px solid #edf2f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#112826' }}>
                    {sourceNode?.name} → {targetNode?.name}
                  </div>
                  <div style={{ fontSize: '9px', color: '#7a8582' }}>{edge.description}</div>
                </div>
                <span style={{ fontSize: '10px', color: '#087267', fontWeight: 700 }}>Inspect →</span>
              </div>
            );
          })}
        </div>
      </div>

      {modalNodeId && (
        <RippleModal
          nodeId={modalNodeId}
          onClose={() => setModalNodeId(null)}
        />
      )}
    </div>
  );
}
