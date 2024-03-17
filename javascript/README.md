# Basic Influence Roles  (BIRs) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/davidemiceli/basic-influence-roles/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/davidemiceli/basic-influence-roles/pulls)

_**Detect and measure the basic role of influence each node plays within a directed network.**_ 

It supports a raw list of nodes, a Graphology DiGraph, as well as a method to be used in a distributed context for Big Data use cases.

This algorithm returns:
- The Basic Influence Role (BIR) of a node in a network
- The BIR's level
- The influence measure related to the role
- A global influence measure based on indegree and outdegree
- The influence ranking of the node

For in-depth theoretical details and more examples, please read the main repository [**intro**](https://github.com/davidemiceli/basic-influence-roles/blob/main/README.md).

## Index of contents

All useful informations can be found in the following paragraphs:
- [**Installation**](#installation)
- [**How to use it**](#how-to-use-it)
  - [**Detect Basic influence Roles**](#detect-birs)
    - [**From a list of nodes**](#list-of-nodes)
    - [**From a Graphology graph**](#graphology-graph)
    - [**In a distributed context**](#distributed-context)
    - [**Outputs**](#results)
  - [**Distributions of roles**](#distribution-birs)
- [**Testing**](#testing)
- [**Citing**](#citing)
- [**License**](#license)

## Installation <a name="installation"></a>
```shell
npm install basic-influence-roles
```

## How to use it <a name="how-to-use-it"></a>

Import BIRs package

Using import:
```javascript
import BIRs from 'basic-influence-roles';
```

Using require:
```javascript
const BIRs = require('basic-influence-roles');
```

## Detect Basic Influence Roles <a name="detect-birs"></a>

Methods to detect BIRs.

### From a list of nodes <a name="list-of-nodes"></a>

```javascript
BIRs.detectFromNodes(nodes=Array[Object]);
```

#### Parameters
Field | Type | Required	| Description
--- | --- | --- | ---
`nodes`	| *[{...}]* | yes | An array of all nodes' data.
`nodes[i].id` | *any*	| yes | The name or id of the node.
`nodes[i].indegree` | *integer* | yes | The number of incoming connections.
`nodes[i].outdegree` | *integer* | yes	| The number of outcoming connections.

##### *Example*
```javascript
// The list of nodes with indegree and outdegree
nodes = [
  {id: 1, indegree: 13, outdegree: 5},
  {id: 2, indegree: 3, outdegree: 8},
  {id: 3, indegree: 0, outdegree: 22},
  {id: 4, indegree: 16, outdegree: 19},
  {...}
];
// Measure the influence score and detect the basic influence roles
res = BIRs.detectFromNodes(nodes);
```

### From a Graphology directed graph <a name="graphology-graph"></a>

Detect roles of a [Graphology Directed Graph](https://graphology.github.io)

```javascript
BIRs.detectGraphology(G);
```

#### Parameters
Type | Required	| Description
--- | --- | ---
*G* | yes | A Graphology directed graph.

##### *Example*
```javascript
const { DirectedGraph } = require('graphology');
// Create a directed graph
const G = new DirectedGraph({multi: false, allowSelfLoops: false});
// Add some nodes and edges
...
// Detect basic influence roles of nodes
res = BIRs.detectGraphology(G);
```

### To use in a distributed context <a name="distributed-context"></a>

In case of Big Data or Huge Networks you can distribute the load in this way:
```javascript
BIRs.detect(indegree, outdegree, nodeCount, data);
```

#### Parameters
Field | Type | Required	| Description
--- | --- | --- | ---
`indegree` | *integer* | yes | The number of incoming connections.
`outdegree` | *integer* | yes | The number of outcoming connections.
`nodeCount` | *integer* | yes | The total number of nodes.
`data` | *boolean* | no | If `true` returns indegree and outdegree.

##### *Example*
```javascript
// Get the total count of nodes
nodeCount = 8586987087;
// For every node in a huge network (use here a distributed loop instead)
nodes.map(([indegree, outdegree]) => {
    // Get basic influence role of every node in network
    return BIRs.detect(indegree, outdegree, nodeCount, true);
});
```

### Output

The output is a list of nodes reporting their id, role, role level, influence measure, influence ranking.

Field | Type | Description
--- | --- | ---
`id` | *any* | The id of node.
`role` | *string* | The basic influence role.
`roleInfluence` | *float* | The influence magnitude related to the node's role.
`roleLevel` | *string* | The level of role, a role subcategory.
`influence` | *float* | A normalized influence score based on indegree and outdegree.
`indegree` | *integer* | The number of incoming connections.
`outdegree` | *integer* | The number of outcoming connections.
`normalizedIndegree` | *float* | The normalized number of incoming connections.
`normalizedOutdegree` | *float* | The normalized number of outcoming connections.
`rank` | *integer* | The normalized influence ranking based on the value of *influence* field.

##### *Example*
```javascript
[
    {
        id: 4,
        role: 'hub',
        roleInfluence: 5.83,
        roleLevel: 'strong',
        influence: 5.83,
        indegree: 16,
        outdegree: 19,
        normalizedIndegree: 5.3,
        normalizedOutdegree: 6.3,
        rank: 1
    },
    {
        id: 3,
        role: 'emitter',
        roleInfluence: 7.3,
        roleLevel: 'strong',
        influence: 3.6666666666666665,
        indegree: 0,
        outdegree: 22,
        normalizedIndegree: 0.0,
        normalizedOutdegree: 7.3,
        rank: 2
    },
    ...
]
```

## Get the distribution of Basic Influence Roles <a name="distribution-birs"></a>

Given a list of BIRs, can be calculated the distribution of BIRs in a network, as a normalized frequency between roles and also between their levels.

```javascript
BIRs.distribution(data=[]);
```

#### Parameters
Field | Type | Required	| Description
--- | --- | --- | ---
`data` | *[{...}]* | yes | The list of roles, the output of BIRs' detection methods.

##### *Example*
```javascript
// Detect basic influence roles of nodes
data = BIRs.detectFromNodes([...])
// Detect the distribution of BIRs
res = BIRs.distribution(data)
```

#### Output
```javascript
{
    reducer: {
        count: 12,
        frequency: 0.12,
        levels: {
            none: {count: 0, frequency: 0.0},
            branch: {count: 0, frequency: 0.0},
            weak: {count: 7, frequency: 0.07},
            strong: {count: 5, frequency: 0.05},
            top: {count: 0, frequency: 0.0}
        }
    },
    amplifier: {
        count: 13,
        frequency: 0.13,
        levels: {
            none: {count: 0, frequency: 0.0},
            branch: {count: 0, frequency: 0.0},
            weak: {count: 12, frequency: 0.12},
            strong: {count: 1, frequency: 0.01},
            top: {count: 0, frequency: 0.0}
        }
    },
    emitter: {
        count: 28,
        frequency: 0.28,
        levels: {
            none: {count: 0, frequency: 0.0},
            branch: {count: 18, frequency: 0.18},
            weak: {count: 10, frequency: 0.1},
            strong: {count: 0, frequency: 0.0},
            top: {count: 0, frequency: 0.0}
        }
    },
    ...
}
```

## Tests <a name="testing"></a>

The package is battle tested with a coverage of 98%. Unit tests are inside the folder `/test`.

At first, install dev requirements:
```shell
npm install
```

To run all unit tests with coverage through nyc, type:
```shell
npm test
```

## Citing <a name="citing"></a>

If you use this software in your work, please cite it as below:
> Miceli, D. (2024). Basic Influence Roles (BIRs) [Computer software]. https://github.com/davidemiceli/basic-influence-roles

Or the BibTeX version:

```bibtex
@software{MiceliBasicInfluenceRoles2024,
  author = {Miceli, Davide},
  license = {MIT},
  month = mar,
  title = {{Basic Influence Roles (BIRs)}},
  url = {https://github.com/davidemiceli/basic-influence-roles},
  year = {2024}
}
```

## License <a name="license"></a>

Basic Influence Roles is an open source project available under the [MIT license](https://github.com/davidemiceli/basic-influence-roles/blob/master/LICENSE).
