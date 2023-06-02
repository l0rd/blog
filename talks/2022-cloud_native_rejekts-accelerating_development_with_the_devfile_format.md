---
date: '2022-05-15'
eventName: 'Cloud_Native Rejekts EU (Valencia)'
eventKind: 'Conference'
title: 'Accelerating development with the Devfile format'
eventLink: 'https://cfp.cloud-native.rejekts.io/cloud-native-rejekts-eu-valencia-2022/schedule/'
eventSessionLink: 'https://cfp.cloud-native.rejekts.io/cloud-native-rejekts-eu-valencia-2022/talk/XJH83S/'
slidesLink: 'https://docs.google.com/presentation/d/1z4ODFHU9vXKLCobnH-9tQg3SaHzDtS47Eg07teGldT8/edit?usp=sharing'
recordingLink: 'https://www.youtube.com/watch?v=_UkU7ACyMCo'
---

## Abstract


Infrastructure as code. Network as code. Everything as a code. It looks like everything can be defined as code, versioned and tested automatically. Everything except development environments. The industry hasn’t come up with a file format to define software environments yet.

Red Hat, AWS and JetBrains are introducing the Devfile. The goal is to accelerate and simplify developers' environment setup. Vagrantfiles and Dockerfiles set the path, a decade ago, with file formats defining general purpose computing environments. Devfile wants to be a file format specialized in the definition of software development environments.

Let's spare developers fragmentation and instead collaborate as a community to jointly promote a new paradigm for development environments. It is in the best interest of developers that the industry starts to settle on an unified environment configuration format.

Currently, vendors of remote cloud-based development environment solutions such as GitHub Codespaces and GitPod are building proprietary solutions for hosting and operating development environments using a similar, yet slightly different environment configuration file (devcontainer.json and gitpod.yaml).

A big challenge for the Devfile is to ensure that it doesn’t become “yet another configuration file”. Instead, we want it to relate and align with any neighboring configuration files used for CI/CD runs or infrastructure provisioning. A Devfile should be able to give developers an inner dev loop that is in sync with the outer dev loop, yet still provide enough flexibility for developers to experiment and have personal tooling preferences.
