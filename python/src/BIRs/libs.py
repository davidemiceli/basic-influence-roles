from math import exp


def degree_dist(adegree, bdegree, max_edges):
    """Get distance from the node's count as max indegree and outdegree"""
    return (adegree + bdegree) / (max_edges * 2)

def near_axis_category(degree, name, max_edges, d):
    """Near axis categories"""
    return name, d, degree / max_edges

def measure_ratio_category(ratioDegree, max_edges):
    """Measure ratio based categories"""
    return 1 - (exp(ratioDegree) - exp(1 / max_edges))

def level_role(indegree, outdegree, v):
    """Sub level category"""
    if indegree == outdegree == 0: return 'none'
    elif (indegree in (0, 1) and outdegree in (0, 1)): return 'branch'
    elif v == 1: return 'top'
    elif v > 0.5: return 'strong'
    return 'weak'

def influence_role(indegree, outdegree, max_edges):
    """Detect influence type"""

    # Calculate distance from the max figured hub
    d = degree_dist(indegree, outdegree, max_edges)

    # Isolated
    if indegree == outdegree == 0: return 'isolated', d, d

    # Emitter area
    if indegree == 0: return near_axis_category(outdegree, 'emitter', max_edges, d)
    
    # Receiver area
    if outdegree == 0: return near_axis_category(indegree, 'receiver', max_edges, d)

    # Calculate degree ratio theshold
    ratioTheshold = 0.7

    # Amplifier area
    ratioDegree = indegree / outdegree
    if ratioDegree <= ratioTheshold:
        return 'amplifier', d, measure_ratio_category(ratioDegree, max_edges)

    # Reducer area
    ratioDegree = outdegree / indegree
    if ratioDegree <= ratioTheshold:
        return 'reducer', d, measure_ratio_category(ratioDegree, max_edges)

    # Remaining are hubs
    return 'hub', d, d

def basic_influence_role(indegree, outdegree, node_count, data=False):
    """Detect Basic Influence Role of a single node"""
    max_links = node_count - 1
    role, influence, role_influence = influence_role(indegree, outdegree, max_links)
    role_level = level_role(indegree, outdegree, role_influence)
    r = dict(
        role=role,
        role_influence=role_influence,
        role_level=role_level,
        influence=influence
    )
    return dict(
        **r,
        indegree=indegree,
        outdegree=outdegree,
        normalized_indegree=indegree / max_links,
        normalized_outdegree=outdegree / max_links
    ) if data else r

def sort_data(n):
    """Sort data based on roles"""
    return n['influence'], n['outdegree'], n['indegree'], n['role_influence'], n['id']

def roles_frequencies(a, d):
    """Aggregate roles frequencies"""
    a.setdefault(d['role'], dict(
        count=0,
        levels=dict(none=0, branch=0, weak=0, strong=0, top=0)
    ))
    a[d['role']]['count'] += 1
    a[d['role']]['levels'][d['role_level']] += 1
    return a