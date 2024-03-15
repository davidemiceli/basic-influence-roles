'use strict';

// Requirements
const expect = require('chai').expect;
const { describe, it } = require('mocha');
const { DirectedGraph } = require('graphology');
const permutations = require('./mocks/permutations');
const distributions = require('./mocks/distributions');
const {edges: testEdges, results: testResults} = require('./mocks/testNetwork');
const BIRs = require('../index');

// Generate Permutations Test Dataset
const generatePermutations = (size, step) => {
    const data = [];
    for (let i = 0; i <= size; i += step) {
        for (let j = 0; j <= size; j += step) {
            data.push({ id: data.length, indegree: i, outdegree: j });
        }
    }
    return data;
}

// Get test dataset
const testGraph = () => {
    const G = new DirectedGraph({multi: false, allowSelfLoops: false});
    G.import({
        nodes: Array.from(Array(100).keys()).map(i => ({key: i})),
        edges: testEdges
    });
    const results = testResults.map(v => { v.id = String(v.id); return v; });
    return [G, results];
}

describe('Basic Influence Roles', () => {

    describe('Given a list of indegree and outdegree', () => {
        it('Should return the influence role', () => {
            const MD = 20, nodeCount = 21;
            [
                // Isolated
                { role: 'isolated', level: 'none', influence: 0, indegree: 0, outdegree: 0 },
                // Branch
                { role: 'emitter', level: 'branch', influence: 0.05, indegree: 0, outdegree: 1 },
                { role: 'receiver', level: 'branch', influence: 0.05, indegree: 1, outdegree: 0 },
                { role: 'hub', level: 'branch', influence: 0.05, indegree: 1, outdegree: 1 },
                // Hub
                { role: 'hub', level: 'top', influence: 1, indegree: MD, outdegree: MD },
                { role: 'hub', level: 'weak', influence: 0.5, indegree: 10, outdegree: 10 },
                { role: 'hub', level: 'strong', influence: 0.525, indegree: 10, outdegree: 11 },
                { role: 'hub', level: 'strong', influence: 0.675, indegree: 14, outdegree: 13 },
                { role: 'hub', level: 'weak', influence: 0.475, indegree: 10, outdegree: 9 },
                { role: 'hub', level: 'weak', influence: 0.275, indegree: 5, outdegree: 6 },
                // Amplifier
                { role: 'amplifier', level: 'top', influence: 1, indegree: 1, outdegree: MD },
                { role: 'amplifier', level: 'strong', influence: 0.8518749943406383, indegree: 2, outdegree: 11 },
                { role: 'amplifier', level: 'strong', influence: 0.6556586712899346, indegree: 2, outdegree: 6 },
                { role: 'amplifier', level: 'strong', influence: 0.6556586712899346, indegree: 1, outdegree: 3 },
                { role: 'amplifier', level: 'weak', influence: 0.1830251389438018, indegree: 10, outdegree: 16 },
                { role: 'amplifier', level: 'weak', influence: 0.4025498256758959, indegree: 1, outdegree: 2 },
                // Reducer
                { role: 'reducer', level: 'top', influence: 1, indegree: MD, outdegree: 1 },
                { role: 'reducer', level: 'strong', influence: 0.8518749943406383, indegree: 11, outdegree: 2 },
                { role: 'reducer', level: 'strong', influence: 0.6556586712899346, indegree: 6, outdegree: 2 },
                { role: 'reducer', level: 'weak', influence: 0.4025498256758959, indegree: 2, outdegree: 1 }
            ].map((v, i) => {
                v.id = i;
                return v;
            }).forEach(d => {
                const n = BIRs.detect(d.indegree, d.outdegree, nodeCount, true);
                expect(n.role).to.equal(d.role);
                expect(n.roleLevel).to.equal(d.level);
                expect(n.roleInfluence).to.equal(d.influence);
            });
        });
    });

    describe('Given all permutations of indegree and outdegree', () => {
        it('Should detect influence role for every permutation', () => {
            const data = generatePermutations(20);
            data.forEach((r, i) => {
                const n = BIRs.detect(r.indegree, r.outdegree, 21, true);
                expect(n).to.deep.equal(permutations[i]);
            });
        });
    });

    describe('Given a list of nodes', () => {
        it('Should detect influence role', () => {
            const [G, expected] = testGraph();
            const nodes = G.nodes().map(n => ({ id: n, indegree: G.inDegree(n), outdegree: G.outDegree(n) }));
            const results = BIRs.detectFromNodes(nodes);
            results.forEach((r, i) => {
                expect(r).to.deep.equal(expected[i]);
            });
        });
    });

    describe('Given a Graphology directed graph', () => {
        it('Should detect influence role', () => {
            const [G, expected] = testGraph();
            const results = BIRs.detectGraphology(G);
            results.forEach((r, i) => {
                expect(r).to.deep.equal(expected[i]);
            });
        });
    });

    describe('Given detected BIRs from a graph', () => {
        it('Should calculate the distribution of influence roles', () => {
            const [G, _] = testGraph();
            const data = BIRs.detectGraphology(G);
            const results = BIRs.distribution(data);
            expect(results).to.deep.equal(distributions);
        });
    });

});
