import { MUMBAI_NODES, MUMBAI_EDGES } from './infrastructureData';

/**
 * Ripple Engine — Traverses downstream infrastructure relationships to project how local disruptions spread
 * @param {string} startNodeId 
 * @param {Array} customNodes 
 * @param {Array} customEdges 
 * @returns {Object} Ripple summary with affected infrastructure, human step labels, and what-if scenarios
 */
export function calculateCascade(startNodeId, customNodes = MUMBAI_NODES, customEdges = MUMBAI_EDGES) {
  const nodeMap = new Map(customNodes.map(n => [n.id, n]));
  const startNode = nodeMap.get(startNodeId);

  if (!startNode) {
    return {
      startNode: null,
      affectedNodes: [],
      totalAffectedCount: 0,
      maxDepth: 0,
      scenarios: { doNothingCount: 0, fixFirstCount: 0 }
    };
  }

  // Build adjacency list for downstream connections
  const adjacencyList = new Map();
  customEdges.forEach(edge => {
    if (!adjacencyList.has(edge.source_node_id)) {
      adjacencyList.set(edge.source_node_id, []);
    }
    adjacencyList.get(edge.source_node_id).push(edge);
  });

  const visited = new Set([startNodeId]);
  const queue = [{ nodeId: startNodeId, depth: 0, reason: 'Disruption Reported Here', relationship: 'origin' }];
  const affectedNodes = [];

  while (queue.length > 0) {
    const current = queue.shift();
    const currentNode = nodeMap.get(current.nodeId);

    if (currentNode) {
      // Human-readable step labels
      let stepLabel = 'STARTING POINT';
      if (current.depth === 1) stepLabel = 'NEXT CONNECTION';
      else if (current.depth === 2) stepLabel = 'DOWNSTREAM EFFECT';
      else if (current.depth >= 3) stepLabel = 'WIDER IMPACT';

      affectedNodes.push({
        node: currentNode,
        depth: current.depth,
        stepLabel,
        reason: current.reason,
        relationshipType: current.relationship
      });
    }

    const outgoingEdges = adjacencyList.get(current.nodeId) || [];
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target_node_id)) {
        visited.add(edge.target_node_id);
        queue.push({
          nodeId: edge.target_node_id,
          depth: current.depth + 1,
          reason: edge.description,
          relationship: edge.relationship_type
        });
      }
    }
  }

  const maxDepth = Math.max(...affectedNodes.map(a => a.depth), 0);
  const totalAffectedCount = affectedNodes.length;

  const scenarios = {
    doNothingCount: totalAffectedCount,
    fixFirstCount: 1,
    preventedImpactsCount: Math.max(0, totalAffectedCount - 1)
  };

  return {
    startNode,
    affectedNodes,
    totalAffectedCount,
    maxDepth,
    scenarios
  };
}
