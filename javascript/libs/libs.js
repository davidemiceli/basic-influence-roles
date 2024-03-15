'use strict';

// Get distance from the node's count as max indegree and outdegree
const degreeDist = (adegree, bdegree, maxEdges) => (adegree + bdegree) / (2 * maxEdges);

// Near axis categories
const nearAxisCategory = (degree, name, maxEdges, d) => [ name, d, degree / maxEdges ];

// Measure ratio based categories
const measureRatioCategory = (ratioDegree, maxEdges) => 1 - (Math.exp(ratioDegree) - Math.exp(1 / maxEdges));

// Sub level category
const levelRole = (indegree, outdegree, v) => {
    if (indegree === 0 && outdegree === 0) return 'none';
    else if ((indegree === 0 || indegree === 1) && (outdegree === 0 || outdegree === 1)) return 'branch';
    else if (v === 1) return 'top';
    else if (v > 0.5) return 'strong';
    return 'weak';
}

// Detect influence type
const influenceRole = (indegree, outdegree, maxEdges) => {
    // Calculate distance from the max figured hub
    const d = degreeDist(indegree, outdegree, maxEdges);

    // Isolated
    if (indegree === 0 && outdegree === 0) return ['isolated', d, d];

    // Emitter area
    if (indegree === 0) return nearAxisCategory(outdegree, 'emitter', maxEdges, d);

    // Receiver area
    if (outdegree === 0) return nearAxisCategory(indegree, 'receiver', maxEdges, d);

    // Calculate degree ratio threshold
    const ratioThreshold = 0.7;

    // Amplifier area
    let ratioDegree = indegree / outdegree;
    if (ratioDegree <= ratioThreshold) return ['amplifier', d, measureRatioCategory(ratioDegree, maxEdges)];

    // Reducer area
    ratioDegree = outdegree / indegree;
    if (ratioDegree <= ratioThreshold) return ['reducer', d, measureRatioCategory(ratioDegree, maxEdges)];

    // Remaining are hubs
    return ['hub', d, d];
}

// Detect Basic Influence Role of a single node
const basicInfluenceRole = (indegree, outdegree, nodeCount, data) => {
    const maxLinks = nodeCount - 1;
    const [role, influence, roleInfluence] = influenceRole(indegree, outdegree, maxLinks);
    const roleLevel = levelRole(indegree, outdegree, roleInfluence);
    const result = { role, roleInfluence, roleLevel, influence };

    return data ? {
        ...result,
        indegree,
        outdegree,
        normalizedIndegree: indegree / maxLinks,
        normalizedOutdegree: outdegree / maxLinks,
    } : result;
}

// Sort data based on roles
const sortData = (a, b) => {
    return (a.influence - b.influence) || (a.outdegree - b.outdegree) || (a.indegree - b.indegree) || (a.roleInfluence - b.roleInfluence) || !String(b.id).localeCompare(String(a.id));
}

// Aggregate roles frequencies
const rolesFrequencies = (acc, data) => {
    if (!acc[data.role]) {
        acc[data.role] = { count: 0, levels: { none: 0, branch: 0, weak: 0, strong: 0, top: 0 } };
    }
    acc[data.role].count += 1;
    acc[data.role].levels[data.roleLevel] += 1;
    return acc;
}

module.exports = {
    basicInfluenceRole,
    sortData,
    rolesFrequencies
};
