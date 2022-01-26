---
title: 'Using Kata Containers to build a Dockerfile on OpenShift'
date: '2022-01-26'
---

Red Hat OpenShift is known for its top-notch security defaults. Running a container as root is not allowed. Running a container as a specific (non root) user is also not allowed. That makes it hard to run `docker build` or `buidah` from a container. We are going to explore how to do that with [Kata Containers](https://github.com/kata-containers/kata-containers).


## Install the Sandbox Containers Operator on OpenShift

First we need to provision an OpenShift cluster that allows nested virtualization. That's not possible on `AWS` so we need to use `GCP`. For the records I am using our internal `cluster bot` and invoke the command `launch 4.8 gcp`.

Once the cluster is ready the first step is to deploy OpenShift Sandbox Containers Operator from OperatorHub

```bash
$ oc create -f - <<EOF
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: sandboxed-containers-operator
  namespace: openshift-sandboxed-containers-operator
spec:
  channel: preview-1.0
  installPlanApproval: Automatic
  name: sandboxed-containers-operator
  source: redhat-operators
  sourceNamespace: openshift-marketplace
EOF
```

Create a `KataConfig`

```bash
$ oc create -f - <<EOF
apiVersion: kataconfiguration.openshift.io/v1
kind: KataConfig
metadata:
  name: example-kataconfig
  namespace: openshift-sandboxed-containers-operator
EOF
```

Wait that the installation is complete: the `.status.totalNodesCount` should match `.status.installationStatus.completed.completedNodesCount`

```bash
$ oc describe kataconfig example-kataconfig
$ oc get -o jsonpath='{.status.installationStatus.completed.completedNodesCount}' \
            kataconfig example-kataconfig \
            -n openshift-sandboxed-containers-operator
$ oc get -o jsonpath='{.status.totalNodesCount}' \
            kataconfig example-kataconfig \
            -n openshift-sandboxed-containers-operator
```

## Start a buildah container using the Kata runtime 

Ok now let’s start a kata container with `buildah` official image and let’s attach it to an `emptyDir` volume

```bash
$ oc create -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: buildah
spec:
  runtimeClassName: kata
  containers:
    - name: docker
      image: quay.io/buildah/stable:latest
      volumeMounts:
      - mountPath: /buildah-out
        name: buildah-out
  volumes:
  - name: buildah-out
    emptyDir: {}
EOF
```

Once the pod is started let’s open a shell in it

```shell
$ oc exec -ti buildah -- bash
```

These are the security capabilities of the the container user (root)

```shell
[root@buildah /]# capsh --print
Current: = cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,cap_audit_read,38,39+ep
Bounding set =cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,cap_audit_read,38,39
Ambient set =
Securebits: 00/0x0/1'b0
 secure-noroot: no (unlocked)
 secure-no-suid-fixup: no (unlocked)
 secure-keep-caps: no (unlocked)
 secure-no-ambient-raise: no (unlocked)
uid=0(root)
gid=0(root)
groups=
```

## Create a simple Dockerfile

Now I would like to create a simple `Dockerfile` that executes a command, runs a script from the build context and finally use `dnf` to install a package

```Dockerfile
FROM fedora:33
RUN ls -l /test-script.sh
RUN /test-script.sh "Hello world"
RUN dnf update -y | tee /output/update-output.txt
RUN dnf install -y gcc
```

This is the `test-script.sh` referenced in the Dockerfile 

```bash
#/bin/bash
echo "Args \$*"
ls -l /
```

To create those files I use these 2 commands from the container shell

```bash
[root@buildah /]# cd /root/ \ &&
cat > test-script.sh <<EOF
#/bin/bash
echo "Args \$*"
ls -l /
EOF \ &&
chmod +x test-script.sh \ &&
cat > Containerfile.test <<EOF
FROM fedora:33
RUN ls -l /test-script.sh
RUN /test-script.sh "Hello world"
RUN dnf update -y | tee /output/update-output.txt
RUN dnf install -y gcc
EOF
```

## Run the build

Now that everyting is set I can try to build the Dockerfile using `buildah`

```bash
[root@buildah /]# buildah -v /buildah-out:/output:rw \
        -v /root/test-script.sh:/test-script.sh:ro \
        build-using-dockerfile \
        -t myimage -f Containerfile.test
```

Unfortunately the command is failing with the following error message

```log
process exited with error: fork/exec /bin/sh: no such file or directorysubprocess exited with status 1
error building at STEP "RUN ls -l /test-script.sh": exit status 1
```
