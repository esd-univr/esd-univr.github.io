---
name: CHASE
summary: >-
  A modular requirement-engineering framework for cyber-physical systems that turns
  heterogeneous specifications into assume-guarantee contracts and connects requirement
  capture, formalisation, validation, synthesis and system-level design exploration.
category: software
kind: Framework
groups: []
order: 4
url: https://chase-cps.github.io/
repository: https://github.com/chase-cps/chase
contact:
  person: michele-lora
publications:
  - label: "CHASE: Contract-Based Requirement Engineering for Cyber-Physical System Design"
    href: https://doi.org/10.23919/DATE.2018.8342122
---

## From requirements to formal analysis

**CHASE** — Contract-based Heterogeneous Analysis and Systems Exploration — is a requirement-engineering framework for cyber-physical systems. Its purpose is to connect requirement capture and formalisation with rigorous validation and design exploration rather than treating these as disconnected activities.

The framework is built around **assume-guarantee (A/G) contracts**. A contract describes the assumptions a component makes about its environment and the guarantees it provides when those assumptions hold. CHASE uses this representation to reason compositionally about requirements, components and complete systems.

![The CHASE representation core library, with the front-end and back-end tool layers around it](./chase-architecture.jpg)
*The representation core stores contracts and system models; front ends formalise requirements and back ends connect the model to analysis and synthesis tools.*

## Representation core

The central CHASE library provides classes and data structures for requirements, components and system models expressed through contracts. It implements contract-algebra operations used to analyse **compatibility, consistency, refinement and composition**, allowing a design problem to be decomposed and checked without abandoning a mathematically defined interface model.

The representation is deliberately heterogeneous. CHASE supports contracts expressed through propositional logic and **Linear Temporal Logic (LTL)**, and it also represents **Signal Temporal Logic (STL)** and **Metric Temporal Logic (MTL)**. Additional model classes cover arithmetic constraints over real values, state-space dynamical systems, graph-based architectural structures and probabilistic information.

## Extensible tools and APIs

CHASE is organised as a modular software infrastructure. The core library can be used independently, while additional modules provide domain-specific languages, logic-oriented tools and back ends to external engines. Public documentation lists integrations with tools such as **Slugs, GR1C, NuSMV and PySTL**.

The core is primarily implemented in **C++**, with a Python interface built through pybind11. This lets researchers implement new design methodologies, requirement front ends and analysis back ends without changing the representation layer itself.

## Requirement capture and validation

The DATE 2018 CHASE paper describes an end-to-end flow in which requirement patterns help translate natural-language design intent into formal contracts. The contract back end can then assess whether requirements are correct, complete and mutually consistent through formal checking problems.

This workflow has been evaluated on cyber-physical design examples including **aircraft power-distribution control** and arbitration of a **mixed-criticality automotive bus**, illustrating the use of the same contract infrastructure across different application domains.

## Research lineage

CHASE grew out of a University of Verona research line on contract-based system design and heterogeneous formal specification, developed through collaboration with researchers at UC Berkeley, the University of Southern California and IBM Research Haifa. It also provides part of the contract-based methodological foundation later used in research on cyber-physical production systems and DeFacto.

## Official resources

- [CHASE website and documentation](https://chase-cps.github.io/)
- [CHASE source repository](https://github.com/chase-cps/chase)
- [DATE 2018 paper](https://doi.org/10.23919/DATE.2018.8342122)
