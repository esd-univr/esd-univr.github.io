---
name: EDACurry
summary: The unified mixed-signal netlist parser.
category: software
kind: Library
groups: []
order: 3
repository: https://github.com/sydelity-net/EDACurry
contact:
  person: enrico-fraccaroli
publications:
  - label: Initial publication on IEEEXplore
    href: https://ieeexplore.ieee.org/document/9568379
---

There are plentiful successors of SPICE language for describing transistor-level designs. For
most of them, the semantic match those of SPICE, and only the syntax is changed. Others instead
provide more default models or analysis tools.

The EDACurry library is based on a shared semantic for reading, writing, or manipulating
transistor-level designs. The ultimate goal of the framework is: reading an input design written
in a specific syntax and then allowing to write the same design in another syntax. First, the
input description is parsed by a language-specific front-end which turns it into an in-memory
abstract syntax tree that follows the common semantic. Then, the in-memory description can be
subject to different user-defined manipulations built on top of a series of API or
visitor/listener classes. Finally, the description goes through the desired back-end,
transforming the in-memory description into the target transistor-level language.

![The EDACurry pipeline: a language front-end, an in-memory abstract syntax tree, and a back-end](./edacurry-structure.jpg)
*A front-end reads the netlist into a shared in-memory tree; a back-end writes it out again.*

Moreover, exploiting the JSON back-end it is possible to print in the output the in-memory
description, subsequently, it is possible to read this JSON description through the appropriate
front-end that allows populating automatically the in-memory description. This series of
operations allows obtaining pipelines of tools to perform structured manipulations of
transistor-level netlists. In addition, exploiting the JSON description produced through the
appropriate back-end it is possible, through a Python script that transforms the file in DOT
language (compatible with the GrapViz library) to visualize the in-memory description as a tree.

![A transistor-level netlist rendered as a tree diagram](./edacurry-netlist-visualisation.jpg)
*The same description rendered as a tree through the JSON back-end and GraphViz.*
