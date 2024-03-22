'use strict';

const {basicInfluenceRole, sortData, rolesFrequencies } = require('./libs');

// Add ranking score
const rank = data => data.sort(sortData).reverse().map((d, i) => { d.rank = i + 1; return d; });

// Detect Basic Influence Role
const detect = (indegree, outdegree, nodeCount, data) => {
    if (indegree >= nodeCount || outdegree >= nodeCount) throw Error('Node count must be greater than indegree or outdegree.');
    return basicInfluenceRole(indegree, outdegree, nodeCount, data);
}

const distribution = data => {
    // Calculate distribution of BIRs
    const nodeCount = data.length;
    const aggRoles = data.reduce(rolesFrequencies, {});
    for (const role in aggRoles) {
        const vr = aggRoles[role];
        vr.frequency = vr.count / nodeCount;
        vr.levels = Object.entries(vr.levels).reduce((acc, [level, count]) => {
            acc[level] = { count, frequency: count / nodeCount };
            return acc;
        }, {});
    }
    return aggRoles;
}

const detectFromNodes = nodes => {
    // Given a list of nodes and their indegree and outdegree, return their BIRs
    const nodeCount = nodes.length;
    const data = nodes.map(n => ({
        id: n.id,
        ...detect(n.indegree, n.outdegree, nodeCount, true),
    }));
    return rank(data);
}

const detectGraphology = G => {
    // Given a Graphology DiGraph, return BIRs of nodes
    if (G.type != 'directed') throw new Error('The graph must be directed: undirected networks are not supported.');
    const nodeCount = G.order;
    const data = G.mapNodes(n => ({
        id: n,
        ...detect(G.inDegree(n), G.outDegree(n), nodeCount, true),
    }));
    return rank(data);
}

module.exports = {
    detect,
    detectFromNodes,
    detectGraphology,
    distribution
}
  