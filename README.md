BrainBook Core Browser
======

![logo.png](build/icons/256x256.png)

BrainBook Core is the core browser part for BrainBook and is derived from Beaker (an experimental peer-to-peer Web browser. It adds new APIs for building hostless applications with Internet of Everything Browser. [Visit the website.](https://brainbook.space.com/)

Please feel free to open usability issues. Join us at #beakerbrowser on Freenode.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installing](#installing)
  - [Binaries](#binaries)
  - [Building from source](#building-from-source)
- [Documentation](#documentation)
- [Vulnerability disclosure](#vulnerability-disclosure)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

### Binaries

**Visit the [Releases Page](https://brainbook.space/install) to find the installer you need.**

### Building from source

Requires node 14 or higher.

In Linux (and in some cases macOS) you need libtool, m4, autoconf, and automake:

```bash
sudo apt-get install libtool m4 make g++ autoconf # debian/ubuntu
sudo dnf install libtool m4 make gcc-c++ libXScrnSaver  # fedora
brew install libtool autoconf automake # macos
```

In Windows, you'll need to install [Python 2.7](https://www.python.org/downloads/release/python-2711/), Visual Studio 2015 or 2017, and [Git](https://git-scm.com/download/win). (You might try [windows-build-tools](https://www.npmjs.com/package/windows-build-tools).) Then run:

```powershell
npm config set python c:/python27
npm config set msvs_version 2017
npm install -g node-gyp
npm install -g gulp
```

To build:

```bash
git clone https://github.com/mingjyesheng-ioteye/brainbook_core
cd brainbook_core/scripts
npm install
npm run rebuild 
npm start
```

If you pull latest from the repo and get weird module errors, do:

```bash
npm run burnthemall
```

## [Documentation](https://brainbook.space/docs/)

## Vulnerability disclosure

See [SECURITY.md](./SECURITY.md) for reporting security issues and vulnerabilities.
