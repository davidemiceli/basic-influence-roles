from functools import reduce
from src.birs.libs import basic_influence_role, sort_data, roles_frequencies


class BIRs:
    """Basic Influence Roles"""

    @staticmethod
    def rank(data):
        """Add ranking score"""
        data.sort(key=sort_data, reverse=True)
        for i, n in enumerate(data): n['rank'] = i + 1
        return data

    @staticmethod
    def detect(indegree, outdegree, node_count, data=False):
        """Detect Basic Influence Role """
        return basic_influence_role(indegree, outdegree, node_count, data)

    @staticmethod
    def distribution(data):
        """Calculate distribution of BIRs"""
        node_count = len(data)
        agg_roles = reduce(roles_frequencies, data, {})
        for _, vr in agg_roles.items():
            vr.update(dict(
                frequency=vr['count'] / node_count,
                levels={
                k: dict(count=v, frequency=v / node_count)
                for k, v in vr['levels'].items()
            }))
        return agg_roles

    @staticmethod
    def detect_from_nodes(nodes):
        """Given a list of nodes and their indegree and outdegree, return their BIRs"""
        node_count = len(nodes)
        data = [
            dict(id=n['id'], **BIRs.detect(n['indegree'], n['outdegree'], node_count, data=True))
            for n in nodes
        ]
        return BIRs.rank(data)

    @staticmethod
    def detect_nx(G):
        """Given a NetworkX DiGraph, return BIRs of nodes"""
        if not G.is_directed():
            raise Exception('The graph must be directed: undirected networks are not supported.')
        node_count = G.number_of_nodes()
        data = [
            dict(id=n, **BIRs.detect(G.in_degree(n), G.out_degree(n), node_count, data=True))
            for n in G.nodes()
        ]
        return BIRs.rank(data)
