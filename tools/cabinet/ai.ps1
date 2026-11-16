<#
.SYNOPSIS
    ai.ps1 - Instant Local PowerShell Command Wizard powered by Ollama (phi4-mini)
.EXAMPLE
    ai "find all files bigger than 100MB in this folder"
    ai "git undo last commit but keep changes"
#>
param(
    [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
    [string[]]$Query
)

$promptText = $Query -join " "

$systemPrompt = @"
You are an expert Windows PowerShell command generator.
Task: The user will describe a task in plain English.
Output ONLY the raw executable Windows PowerShell (or Git) command that performs this task.
STRICT RULES:
1. Output NO markdown, NO code fences (```), and NO explanations.
2. Return ONLY the single-line or multi-line command ready to run in PowerShell.
3. Use modern, robust PowerShell cmdlets.
"@

$body = @{
    model = "phi4-mini:latest"
    messages = @(
        @{ role = "system"; content = $systemPrompt },
        @{ role = "user"; content = $promptText }
    )
    stream = $false
    options = @{
        temperature = 0.1
    }
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/chat" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 15
    $command = $response.message.content.Trim()
    
    # Clean any accidental markdown backticks
    $command = $command -replace '^```[a-zA-Z]*\r?\n', '' -replace '\r?\n```$', ''
    $command = $command.Trim('`').Trim()

    Write-Host "`n[SUGGESTED COMMAND]:" -ForegroundColor Cyan
    Write-Host "  $command" -ForegroundColor Yellow
    Write-Host ""

    $choice = Read-Host "[E]xecute | [C]opy to Clipboard | [Enter] to Cancel"
    if ($choice -match '^\s*\[?[eE]\]?\s*$') {
        Write-Host "`n>>> Running: $command`n" -ForegroundColor Green
        Invoke-Expression $command
    } elseif ($choice -match '^\s*\[?[cC]\]?\s*$') {
        Set-Clipboard -Value $command
        Write-Host "Copied to clipboard!" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERROR]: Could not connect to Ollama. Make sure 'ollama serve' is running on port 11434." -ForegroundColor Red
}
