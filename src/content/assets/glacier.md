---
name: The GLACIER Project
summary: >-
  An open and extensible ecosystem for virtual prototyping, digital twins and early testing
  of cyber-physical production systems, connecting deterministic simulation, heterogeneous
  machine models, manufacturing software and communication behaviour before deployment.
category: project
kind: Ecosystem
groups: []
order: 5
contact:
  person: sebastiano-gaiardelli
publications:
  - label: "Digital Twin Integration using Lingua Franca and FMI for Testing Factory Automation Software"
    href: https://doi.org/10.1109/IECON55916.2024.10905305
  - label: "Frost: A Simulation Platform for Early Validation and Testing of Manufacturing Software"
    href: https://iris.univr.it/handle/11562/1171954
---

## Virtual testbeds for cyber-physical production systems

The **GLACIER** project develops an ecosystem for designing, prototyping, monitoring and optimising cyber-physical production systems (CPPSs). Its central idea is to make manufacturing software testable against a sufficiently realistic virtual plant **before** that software is deployed on expensive or safety-critical machinery.

Modern production systems combine machines, sensors, controllers, software services, industrial networks and data models. Testing only the control code in isolation misses the timing and interaction behaviour created by those components. GLACIER therefore treats the virtual testbed as a system-level model in which physical and software components can be represented together and exercised under repeatable scenarios.

## Digital twins with different levels of fidelity

The ecosystem is intended to support several levels of abstraction. A simple model may mirror state or data from a physical component, while a higher-fidelity model may reproduce timing, communication and dynamic behaviour for predictive simulation. This lets a virtual plant evolve incrementally: a component can begin as an abstract model and later be replaced by a richer simulator or by the real machine in a machine-in-the-loop setup.

That flexibility is particularly useful for **service-oriented manufacturing**, where software and machinery interact through explicit services and communication protocols and the overall behaviour depends on more than the local control logic of a single machine.

## Lingua Franca, FMI and industrial communication

Research feeding the GLACIER ecosystem uses **Lingua Franca** as a coordination and simulation framework. Lingua Franca provides deterministic execution semantics for reactive components, making timing and event ordering reproducible during validation.

A 2024 IECON study combines Lingua Franca with the **Functional Mock-up Interface (FMI)** so that heterogeneous simulators can participate in the same digital twin. It also models software–machine interaction through **OPC UA** and demonstrates the approach on a logistics subsystem of a manufacturing system. This provides a path from detailed physical simulators to deterministic software-in-the-loop validation without forcing all components into one modelling formalism.

## Frost simulation platform

A major research outcome in this line is **Frost**, an open-source simulation platform for early validation and testing of manufacturing software. Frost is built on Lingua Franca and provides modelling elements for sensors, machines, control software and communication infrastructure. Its deterministic execution model is intended to make virtual experiments reproducible and to expose integration problems before deployment on the real plant.

The 2025 Frost work validates the platform by implementing a digital twin of a real manufacturing system and evaluating the overhead introduced by the simulation infrastructure. Together with the Lingua Franca/FMI work, it gives GLACIER a concrete technical path from heterogeneous component models to repeatable factory-software testing.

## Research lineage

The GLACIER material on the former CISD site identified Sebastiano Gaiardelli as contact. Current publications in this research line also involve Pietro Turco, Enrico Fraccaroli, Michele Lora, Nicola Dall'Ora and Franco Fummi. Those names are not turned into a formal project-membership list here unless a project source states that relationship directly.

The former dedicated GLACIER website is no longer publicly available at its previous address, so this page deliberately does not publish a dead `Website` link. Stable publication and institutional records are used instead.

## Research records

- [Digital Twin Integration using Lingua Franca and FMI — University of Verona IRIS](https://iris.univr.it/handle/11562/1171267)
- [Frost — University of Verona IRIS](https://iris.univr.it/handle/11562/1171954)
