# Basic Influence Roles  &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/davidemiceli/basic-influence-roles/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/davidemiceli/basic-influence-roles/pulls)

Basic Influence Roles is a python package to detect and measure the role of influence each node plays within a directed network.

## Documentation

All useful informations can be found in the wiki documentation:
- [**Introduction**](https://github.com/davidemiceli/basic-influence-roles/wiki)
- [**Installation**](https://github.com/davidemiceli/basic-influence-roles/wiki/Installation)
- [**Testing**](https://github.com/davidemiceli/basic-influence-roles/wiki/testing)

## Getting started

### Install
```shell
pip install basic-influence-roles
```

### How to use it

Import BIRs package

```python
from src.birs import BIRs
```

#### From a list of nodes

```python
# The list of nodes with indegree and outdegree
nodes = [
  {'id': 1, 'indegree': 13, 'outdegree': 5},
  {'id': 2, 'indegree': 3, 'outdegree': 8},
  {'id': 3, 'indegree': 0, 'outdegree': 22},
  {'id': 4, 'indegree': 16, 'outdegree': 19},
  {...}
]
# Measure the influence score and detect the influence roles
res = BIRs.detect_from_nodes(nodes)
```

#### From a NetworkX graph

```python
G = nx.erdos_renyi_graph(100, 0.01, seed=268451, directed=True)
G.remove_edges_from(nx.selfloop_edges(G))
```

#### To use in a distributed context

In case of Big Data or Huge Networks you can distribute the load in this way:

```python
# Get the total count of nodes
node_count = 8586987087
# For every node in a huge network
for n in nodes:
    # Get basic influence role of every node in network
    data = BIRs.detect(n['indegree'], n['outdegree'], node_count, True)
```

That will return as result:
```python
...
```

## Tests

Unit tests are inside the folder `/test`.

To run all unit tests, type:
```shell
python -m unittest discover test -v
```

# License

Basic Influence Roles is an open source project available under the [MIT license](https://github.com/davidemiceli/basic-influence-roles/blob/master/LICENSE).
