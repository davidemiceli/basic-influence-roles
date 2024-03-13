import unittest
import networkx as nx
import BIRs
from mocks.permutations import permutations
from mocks.test_graph import test_graph
from mocks.distributions import distributions


def generatePermutations(size, step=1):
    """Generate Test Dataset"""
    return [dict(id=i, **n) for i, n in enumerate([
        dict(indegree=indegree, outdegree=outdegree)
        for indegree in range(0, size+1, step)
        for outdegree in range(0, size+1, step)
    ])]

def testGraph():
    """Get test dataset"""
    G = nx.erdos_renyi_graph(100, 0.01, seed=268451, directed=True)
    G.remove_edges_from(nx.selfloop_edges(G))
    return G

class TestInfluenceTypes(unittest.TestCase):

    def test_influenceType(self):
        """Must return the influence role"""
        MD, node_count = 20, 21
        data = [dict(id=i, **n) for i, n in enumerate([
            # Isolated
            dict(role='isolated', level='none', influence=0, indegree=0, outdegree=0),
            # Branch
            dict(role='emitter', level='branch', influence=0.05, indegree=0, outdegree=1),
            dict(role='receiver', level='branch', influence=0.05, indegree=1, outdegree=0),
            dict(role='hub', level='branch', influence=0.05, indegree=1, outdegree=1),
            # Hub
            dict(role='hub', level='top', influence=1, indegree=MD, outdegree=MD),
            dict(role='hub', level='weak', influence=0.5, indegree=10, outdegree=10),
            dict(role='hub', level='strong', influence=0.525, indegree=10, outdegree=11),
            dict(role='hub', level='strong', influence=0.675, indegree=14, outdegree=13),
            dict(role='hub', level='weak', influence=0.475, indegree=10, outdegree=9),
            dict(role='hub', level='weak', influence=0.275, indegree=5, outdegree=6),
            # Amplifier
            dict(role='amplifier', level='top', influence=1, indegree=1, outdegree=MD),
            dict(role='amplifier', level='strong', influence=0.8518749943406383, indegree=2, outdegree=11),
            dict(role='amplifier', level='strong', influence=0.6556586712899346, indegree=2, outdegree=6),
            dict(role='amplifier', level='strong', influence=0.6556586712899346, indegree=1, outdegree=3),
            dict(role='amplifier', level='weak', influence=0.1830251389438018, indegree=10, outdegree=16),
            dict(role='amplifier', level='weak', influence=0.4025498256758959, indegree=1, outdegree=2),
            # Reducer
            dict(role='reducer', level='top', influence=1, indegree=MD, outdegree=1),
            dict(role='reducer', level='strong', influence=0.8518749943406383, indegree=11, outdegree=2),
            dict(role='reducer', level='strong', influence=0.6556586712899346, indegree=6, outdegree=2),
            dict(role='reducer', level='weak', influence=0.4025498256758959, indegree=2, outdegree=1)
        ])]
        for d in data:
            n = BIRs.detect(d.get('indegree'), d.get('outdegree'), node_count, True)
            self.assertEqual(n['role'], d.get('role'))
            self.assertEqual(n['role_level'], d.get('level'))
            self.assertEqual(n['role_influence'], d.get('influence'))

    def test_detect(self):
        """Must detect influence role of all indegree and outdegree permutations"""
        MD, node_count = 20, 21
        data = generatePermutations(MD)
        for i, r in enumerate(data):
            n = BIRs.detect(r['indegree'], r['outdegree'], node_count, True)
            self.assertDictEqual(n, permutations[i])

    def test_detect_from_nodes(self):
        """Must detect the influence role from nodes"""
        G = testGraph()
        nodes = [dict(id=n, indegree=G.in_degree(n), outdegree=G.out_degree(n)) for n in G.nodes()]
        res = BIRs.detect_from_nodes(nodes)
        for i, r in enumerate(res):
            self.assertDictEqual(r, test_graph[i])

    def test_nx_detect(self):
        """Must detect the influence role from networkx graph"""
        G = testGraph()
        res = BIRs.detect_nx(G)
        for i, r in enumerate(res):
            self.assertDictEqual(r, test_graph[i])

    def test_distribution(self):
        """Must calculate the distribution of influence roles"""
        G = testGraph()
        data = BIRs.detect_nx(G)
        res = BIRs.distribution(data)
        self.assertDictEqual(res, distributions)
        total = sum(v['frequency'] for v in res.values())
        self.assertEqual(total, 1)


if __name__ == '__main__':
    unittest.main()
