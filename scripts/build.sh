#!/usr/bin/env bash
# Does the same thing as build.ps1 except in Bash (for Linux/macOS)

buildPath="dist"
srcPath="src"

if [ -d "$buildPath" ]; then
    rm -rf "$buildPath"
fi

if [ ! -d "$buildPath" ]; then
    mkdir "$buildPath"
fi

ENTRYPOINTS=$(find "$srcPath" -type f \( -name "*.ts" -o -name "*.js" \) ! -path "*node_modules*")

npx esbuild $ENTRYPOINTS --log-level=warning --outdir="$buildPath" --outbase="$srcPath" --sourcemap --target="node16" --platform="node" --format="cjs"

cp -r "$srcPath/config" "$buildPath"
cp -r "$srcPath/views" "$buildPath"
cp -r "$srcPath/public" "$buildPath"