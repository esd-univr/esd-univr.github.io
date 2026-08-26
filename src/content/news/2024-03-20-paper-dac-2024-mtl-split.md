---
title: "ESD Group: Paper Accepted at 61st Design Automation Conference (DAC) 2024"
date: 2024-03-20
legacyId: 31
groups: [esd]
author: enrico-fraccaroli
category: Publication
summary: "\"MTL-Split: Multi-Task Learning for Edge Devices using Split Computing\" partitions a multi-task neural network between an edge device and a remote server."
---

Our paper "**MTL-Split: Multi-Task Learning for Edge Devices using Split Computing**" has been accepted at the **61st Design Automation Conference (DAC) 2024**.

Split Computing (SC), where a Deep Neural Network (DNN) is intelligently split with a part of it deployed on an edge device and the rest on a remote server is emerging as a promising approach. It allows the power of DNNs to be leveraged for latency-sensitive applications that do not allow the entire DNN to be deployed remotely, while not having sufficient computation bandwidth available locally. In many such embedded scenarios, such as those in the automotive domain, computational resource constraints also necessitate Multi-Task Learning (MTL), where the same DNN is used for multiple inference tasks instead of having dedicated DNNs for each task, which would need more computing bandwidth. However, how to partition such a multi-tasking DNN to be deployed within a SC framework has not been sufficiently studied. This paper studies this problem, and MTL-Split, our novel proposed architecture, shows encouraging results on both synthetic and real-world data. The source code is available at [github.com/intelligolabs/MTL-Split](https://github.com/intelligolabs/MTL-Split).
