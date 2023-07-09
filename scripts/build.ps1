# Does the same thing as build.sh except in Powershell (for Windows)

$buildPath = ".\dist"
$srcPath = '.\src'

if (Test-Path -Path $buildPath -PathType Container) {
    Remove-Item -Path $buildPath -Recurse -Force
}

New-Item -ItemType Directory -Path $buildPath

$ENTRYPOINTS = Get-ChildItem -Path $srcPath -Recurse -File -Include "*.ts", "*.js" | Where-Object { $_.FullName -notlike "*\node_modules\*" }

node node_modules\esbuild\bin\esbuild $ENTRYPOINTS --log-level=warning --outdir=$buildPath --outbase=$srcPath --sourcemap --target='node16' --platform='node' --format='cjs'
