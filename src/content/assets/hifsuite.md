---
name: HIFSuite
summary: >-
  A family of tools and APIs built around the HDL Intermediate Format (HIF), providing a
  common representation for heterogeneous hardware-description languages and supporting
  conversion, model manipulation, abstraction and refinement, verification and fault injection.
category: software
kind: Tools and APIs
groups: []
order: 2
url: https://esd-univr.github.io/hif-website/
contact:
  person: enrico-fraccaroli
publications:
  - label: "HIFSuite: Tools for HDL code conversion and manipulation — HLDVT 2010"
    href: https://doi.org/10.1109/HLDVT.2010.5496665
  - label: "HIFSuite: Tools for HDL Code Conversion and Manipulation — EURASIP Journal on Embedded Systems"
    href: https://doi.org/10.1155/2010/436328
---

## One intermediate representation for heterogeneous HDL models

**HIFSuite** is a family of tools and application programming interfaces for modelling and verification of hardware/software systems. Its core is the **HDL Intermediate Format (HIF)**: a common representation placed between language-specific front ends and back ends.

Instead of building a dedicated converter for every pair of hardware-description languages, a front end translates a supported source language into HIF and a back end emits the desired target language. This architecture gives conversion and analysis tools a shared internal model and makes it possible to combine components originally described with different HDLs.

![The HIF intermediate format sitting between the HDL front-end tools and the back-end tools](./hifsuite-structure.jpg)
*HIF provides the common representation between language-specific front ends, analysis and manipulation tools, and back ends.*

## Manipulation and verification

The HIF APIs are designed for more than syntax translation. Tools built on the representation can inspect and transform a design, support **abstraction and refinement**, and perform checks after refinement. The same manipulation infrastructure has also been used for **fault injection**, producing modified models for verification and dependability analysis.

This is the main architectural value of HIFSuite: transformations and analyses can operate on the common representation rather than being reimplemented separately for each input language. The published HIFSuite work describes this approach as support for both modelling and verification of heterogeneous HW/SW systems.

## From HDL conversion to smart-system virtual platforms

HIFSuite has been developed and reused over a long research line rather than as a one-off converter. In 2016 the University of Verona project **TLM Smart Systems Modeling** explicitly extended HIFSuite towards modelling and simulation of smart systems. The objective was to start from heterogeneous systems represented at different abstraction levels and automatically produce **C++ transaction-level virtual platforms**, supporting faster integration, simulation and validation.

That institutional project involved Enrico Fraccaroli, Franco Fummi, Michele Lora, Graziano Pravadelli and Davide Quaglia, showing how the HIF intermediate representation evolved into infrastructure for broader system-level modelling workflows.

## Published foundation

The original HIFSuite architecture was documented in both the 2010 IEEE High Level Design Validation and Test Workshop and an extended article in the **EURASIP Journal on Embedded Systems**. The journal article describes HIFSuite as a set of tools and APIs centred on HIF for HDL conversion, heterogeneous-component integration and design manipulation; it was published as an open-access article.

## Official resources

- [HIFSuite website](https://esd-univr.github.io/hif-website/)
- [University of Verona — TLM Smart Systems Modeling project](https://www.dimi.univr.it/?ent=progetto&id=4725&lang=ena)
