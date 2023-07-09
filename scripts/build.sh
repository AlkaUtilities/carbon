#!/usr/bin/env bash

buildPath="dist"
srcPath="src"

set -e

rm -rf $buildPath
mkdir -p $buildPath

ENTRYPOINTS=$(find -type f -name '*.[tj]s' -not -path './node_modules/*')

esbuild $ENTRYPOINTS --log-level=warning --outdir=$buildPath --outbase=$srcPath --sourcemap --target='node16' --platform='node' --format='cjs'