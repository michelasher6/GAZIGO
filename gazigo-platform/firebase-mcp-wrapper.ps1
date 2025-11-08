# Firebase MCP Wrapper Script for Windows
# This script finds Node.js and runs firebase-tools MCP server
# Must use -NoProfile for stdio communication

# Common Node.js installation paths
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:APPDATA\npm\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:ProgramFiles\nodejs\node.exe"
)

# Try to find node in PATH first
$nodeExe = $null
try {
    $nodeExe = Get-Command node -ErrorAction Stop | Select-Object -ExpandProperty Source
} catch {
    # Node not in PATH, try common locations
    foreach ($path in $nodePaths) {
        if (Test-Path $path) {
            $nodeExe = $path
            break
        }
    }
}

if (-not $nodeExe) {
    [Console]::Error.WriteLine("Node.js not found. Please install Node.js from https://nodejs.org/")
    exit 1
}

# Find npx (usually in same directory as node)
$nodeDir = Split-Path $nodeExe
$npxPath = Join-Path $nodeDir "npx.cmd"
if (-not (Test-Path $npxPath)) {
    $npxPath = Join-Path $nodeDir "npx"
}

# If npx not found, try npm exec
if (-not (Test-Path $npxPath)) {
    $npmPath = Join-Path $nodeDir "npm.cmd"
    if (Test-Path $npmPath) {
        # Use npm exec as fallback
        & $npmPath exec -y firebase-tools@latest mcp
        exit $LASTEXITCODE
    } else {
        [Console]::Error.WriteLine("Neither npx nor npm found in Node.js installation directory.")
        exit 1
    }
}

# Use npx to run firebase-tools MCP
& $npxPath -y firebase-tools@latest mcp
exit $LASTEXITCODE

