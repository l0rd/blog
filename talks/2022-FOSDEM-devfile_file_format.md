---
date: '2022-02-06'
eventName: 'FOSDEM (Containers devroom)'
eventKind: 'Conference'
title: 'The Devfile File Format'
eventLink: 'https://fosdem.org/2022/schedule/track/containers/'
eventSessionLink: 'https://fosdem.org/2022/schedule/event/container_devfile/'
slidesLink: 'https://docs.google.com/presentation/d/1Eej4acWaxpwHKNyGQS5gInJZ3tCDsRH4skCYAIqjVhc/edit#slide=id.p'
recordingLink: ''
---

## Abstract

Red Hat, AWS and JetBrains are working on the Devfile specification. A file format to define container-based development environments. Software development acceleration is the ultimate goal.

Infrastructure as code. Network as code. Everything as a code. It looks like everything can be defined as code, versioned and tested automatically. Everything except development environments. The industry hasn’t come up with a file format to define software environments yet.

But It is in the best interest of developers that the industry starts to settle on an unified environment configuration format. Currently, vendors of remote cloud-based development environment solutions such as GitHub Codespaces and GitPod are building proprietary solutions for hosting and operating development environments using a similar, yet slightly different environment configuration file (devcontainer.json and gitpod.yaml).

A big challenge for the Devfile is to ensure that it doesn’t become “yet another configuration file”. Instead, we want it to relate and align with any neighboring configuration files used for CI/CD runs or infrastructure provisioning. A Devfile should be able to give developers an inner dev loop that is in sync with the outer dev loop, yet still provide enough flexibility for developers to experiment and have personal tooling preferences.