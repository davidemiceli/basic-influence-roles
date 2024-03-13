# Basic Influence Roles  (BIRs) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/davidemiceli/basic-influence-roles/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/davidemiceli/basic-influence-roles/pulls)

_**Detect and measure the basic role of influence each node plays within a directed network.**_ 

It support a raw list of nodes, a NetworkX DiGraph, as well as a method to be used in a distributed context for Big Data use cases.

For in-depth theoretical details, please read the main repository [**intro**](https://github.com/davidemiceli/basic-influence-roles/blob/main/README.md).

## Index of contents

All useful informations can be found in the following paragraphs:
- [**Installation**](#installation)
- [**How to use it**](#how-to-use-it)
  - [**Detect Basic influence Roles**](#detect-birs)
    - [**From a list of nodes**](#list-of-nodes)
    - [**From a NetworkX graph**](#networkx-graph)
    - [**In a distributed context**](#distributed-context)
    - [**Outputs**](#results)
  - [**Distributions of roles**](#distribution-birs)
- [**Testing**](#testing)
- [**License**](#license)

## Installation <a name="installation"></a>
```shell
pip install basic-influence-roles
```

## How to use it <a name="how-to-use-it"></a>

Import BIRs package

```python
import BIRs
```

## Detect Basic Influence Roles <a name="detect-birs"></a>

Methods to detect BIRs.

### From a list of nodes <a name="list-of-nodes"></a>

```python
BIRs.detect_from_nodes(nodes=List[Dict])
```

#### Parameters
Field | Type | Required	| Description
--- | --- | --- | ---
`nodes`	| *[{...}]* | yes | An list of all nodes' data as dict.
`nodes[i]['id']` | *any*	| yes | The name or id of the node.
`nodes[i]['indegree']` | *integer* | yes | The number of incoming connections.
`nodes[i]['outdegree']` | *integer* | yes	| The number of outcoming connections.

##### *Example*
```python
# The list of nodes with indegree and outdegree
nodes = [
  {'id': 1, 'indegree': 13, 'outdegree': 5},
  {'id': 2, 'indegree': 3, 'outdegree': 8},
  {'id': 3, 'indegree': 0, 'outdegree': 22},
  {'id': 4, 'indegree': 16, 'outdegree': 19},
  {...}
]
# Measure the influence score and detect the basic influence roles
res = BIRs.detect_from_nodes(nodes)
```

### From a NetworkX graph <a name="networkx-graph"></a>

```python
BIRs.detect_nx(nx.DiGraph)
```

#### Parameters
Type | Required	| Description
--- | --- | ---
*nx.DiGraph* | yes | A NetworkX directed graph.

##### *Example*
```python
# Create a random directed graph
G = nx.erdos_renyi_graph(100, 0.01, directed=True)
# Remove possible self-loop edges
G.remove_edges_from(nx.selfloop_edges(G))
# Detect basic influence roles of nodes
res = BIRs.detect_nx(G)
```

### To use in a distributed context <a name="distributed-context"></a>

In case of Big Data or Huge Networks you can distribute the load in this way:
```python
BIRs.detect(indegree, outdegree, node_count)
```

#### Parameters
Field | Type | Required	| Description
--- | --- | --- | ---
`indegree` | *integer* | yes | The number of incoming connections.
`outdegree` | *integer* | yes	| The number of outcoming connections.
`node_count` | *integer* | yes	| The total number of nodes.

##### *Example*
```python
# Get the total count of nodes
node_count = 8586987087
# For every node in a huge network (use here a distributed loop instead)
for indegree, outdegree in nodes:
    # Get basic influence role of every node in network
    res = BIRs.detect(indegree, outdegree, node_count, True)
```

### Output

The output is a list of nodes reporting their id, role, role level, influence measure, influence ranking.

Field | Type | Description
--- | --- | ---
`id` | *any* | The id of node.
`role` | *string* | The basic influence role.
`role_influence` | *float* | The influence magnitude related to the node's role.
`role_level` | *string* | The level of role, a role subcategory.
`influence` | *float* | A normalized influence score based on indegree and outdegree.
`indegree` | *integer* | The number of incoming connections.
`outdegree` | *integer* | The number of outcoming connections.
`normalized_indegree` | *float* | The normalized number of incoming connections.
`normalized_outdegree` | *float* | The normalized number of outcoming connections.
`rank` | *integer* | The normalized influence ranking based on the value of *influence* field.

##### *Example*
```python
[
    {
        'id': 4,
        'role': 'hub',
        'role_influence': 5.83,
        'role_level': 'strong',
        'influence': 5.83,
        'indegree': 16,
        'outdegree': 19,
        'normalized_indegree': 5.3,
        'normalized_outdegree': 6.3,
        'rank': 1
    },
    {
        'id': 3,
        'role': 'emitter',
        'role_influence': 7.3,
        'role_level': 'strong',
        'influence': 3.6666666666666665,
        'indegree': 0,
        'outdegree': 22,
        'normalized_indegree': 0.0,
        'normalized_outdegree': 7.3,
        'rank': 2
    },
    ...
]
```

## Get the distribution of Basic Influence Roles <a name="distribution-birs"></a>

Given a list of BIRs, can be calculated the distribution of BIRs in a network, as a normalized frequency between roles and also between their levels.

```python
BIRs.distribution(data=[])
```

#### Parameters
Field | Type | Required	| Description
--- | --- | --- | ---
`data` | *[{...}]* | yes | The list of roles, the output of BIRs' detection methods.

##### *Example*
```python
# Create a random directed graph
G = nx.erdos_renyi_graph(100, 0.01, directed=True)
# Remove possible self-loop edges
G.remove_edges_from(nx.selfloop_edges(G))
# Detect basic influence roles of nodes
data = BIRs.detect_nx(G)
# Detect the distribution of BIRs
res = BIRs.distribution(data)
```

#### Output
```python
{
    'reducer': {
        'count': 12,
        'frequency': 0.12,
        'levels': {
            'none': {'count': 0, 'frequency': 0.0},
            'branch': {'count': 0, 'frequency': 0.0},
            'weak': {'count': 7, 'frequency': 0.07},
            'strong': {'count': 5, 'frequency': 0.05},
            'top': {'count': 0, 'frequency': 0.0}
        }
    },
    'amplifier': {
        'count': 13,
        'frequency': 0.13,
        'levels': {
            'none': {'count': 0, 'frequency': 0.0},
            'branch': {'count': 0, 'frequency': 0.0},
            'weak': {'count': 12, 'frequency': 0.12},
            'strong': {'count': 1, 'frequency': 0.01},
            'top': {'count': 0, 'frequency': 0.0}
        }
    },
    'emitter': {
        'count': 28,
        'frequency': 0.28,
        'levels': {
            'none': {'count': 0, 'frequency': 0.0},
            'branch': {'count': 18, 'frequency': 0.18},
            'weak': {'count': 10, 'frequency': 0.1},
            'strong': {'count': 0, 'frequency': 0.0},
            'top': {'count': 0, 'frequency': 0.0}
        }
    },
    ...
}
```

## Tests <a name="testing"></a>

The package is battle tested with a coverage of 98%. Unit tests are inside the folder `/test`.

At first, install dev requirements:
```shell
pip install -r requirements-dev.txt
```

To run all unit tests with coverage, type:
```shell
PYTHONPATH=src python -m coverage run --source=src -m unittest discover test -v
```

Or run the bash script:
```shell
./test.sh
```

To run the coverage report:
```shell
coverage report -m
```

## License <a name="license"></a>

Basic Influence Roles is an open source project available under the [MIT license](https://github.com/davidemiceli/basic-influence-roles/blob/master/LICENSE).
