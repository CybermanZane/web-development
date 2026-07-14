Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
$appUrl = 'http://127.0.0.1:5173'
$script:serverProcess = $null

function Test-AppRunning {
  try {
    $response = Invoke-WebRequest -Uri $appUrl -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Set-Status([string] $message, [System.Drawing.Color] $color) {
  $statusLabel.Text = $message
  $statusLabel.ForeColor = $color
}

function Get-PackageManager {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) { return 'pnpm' }
  if (Get-Command npm -ErrorAction SilentlyContinue) { return 'npm' }
  throw 'Node.js nije pronađen. Instaliraj Node.js LTS, zatim ponovo pokreni launcher.'
}

$form = New-Object System.Windows.Forms.Form
$form.Text = 'Login Page Launcher'
$form.ClientSize = New-Object System.Drawing.Size(470, 275)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(8, 11, 13)
$form.Font = New-Object System.Drawing.Font('Segoe UI', 10)

$title = New-Object System.Windows.Forms.Label
$title.Text = 'Login Page'
$title.Location = New-Object System.Drawing.Point(32, 28)
$title.AutoSize = $true
$title.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 22)
$title.ForeColor = [System.Drawing.Color]::White
$form.Controls.Add($title)

$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = 'Pokreni lokalnu React aplikaciju i otvori je u browseru.'
$subtitle.Location = New-Object System.Drawing.Point(34, 71)
$subtitle.AutoSize = $true
$subtitle.ForeColor = [System.Drawing.Color]::FromArgb(184, 197, 213)
$form.Controls.Add($subtitle)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = 'Status: aplikacija nije pokrenuta'
$statusLabel.Location = New-Object System.Drawing.Point(34, 111)
$statusLabel.AutoSize = $true
$statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(184, 197, 213)
$form.Controls.Add($statusLabel)

$startButton = New-Object System.Windows.Forms.Button
$startButton.Text = 'Pokreni aplikaciju'
$startButton.Location = New-Object System.Drawing.Point(34, 153)
$startButton.Size = New-Object System.Drawing.Size(185, 43)
$startButton.FlatStyle = 'Flat'
$startButton.BackColor = [System.Drawing.Color]::FromArgb(31, 79, 96)
$startButton.ForeColor = [System.Drawing.Color]::White
$startButton.Add_Click({
  try {
    if (Test-AppRunning) {
      Start-Process $appUrl
      Set-Status 'Status: aplikacija je već pokrenuta' ([System.Drawing.Color]::FromArgb(135, 214, 165))
      return
    }
    $manager = Get-PackageManager
    Set-Status 'Status: pokretanje aplikacije…' ([System.Drawing.Color]::FromArgb(255, 214, 110))
    $command = "Set-Location -LiteralPath '$projectPath'; $manager dev -- --host 127.0.0.1"
    $script:serverProcess = Start-Process powershell.exe -ArgumentList '-NoProfile', '-Command', $command -WindowStyle Hidden -PassThru
    for ($i = 0; $i -lt 20; $i++) {
      Start-Sleep -Milliseconds 500
      if (Test-AppRunning) {
        Start-Process $appUrl
        Set-Status 'Status: aplikacija je pokrenuta na http://127.0.0.1:5173' ([System.Drawing.Color]::FromArgb(135, 214, 165))
        return
      }
    }
    Set-Status 'Status: server se nije pokrenuo — provjeri jesu li paketi instalirani' ([System.Drawing.Color]::FromArgb(255, 140, 140))
  } catch {
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Pokretanje nije uspjelo', 'OK', 'Error')
    Set-Status 'Status: pokretanje nije uspjelo' ([System.Drawing.Color]::FromArgb(255, 140, 140))
  }
})
$form.Controls.Add($startButton)

$openButton = New-Object System.Windows.Forms.Button
$openButton.Text = 'Otvori u browseru'
$openButton.Location = New-Object System.Drawing.Point(235, 153)
$openButton.Size = New-Object System.Drawing.Size(185, 43)
$openButton.FlatStyle = 'Flat'
$openButton.BackColor = [System.Drawing.Color]::FromArgb(235, 242, 246)
$openButton.ForeColor = [System.Drawing.Color]::FromArgb(25, 42, 56)
$openButton.Add_Click({ Start-Process $appUrl })
$form.Controls.Add($openButton)

$stopButton = New-Object System.Windows.Forms.Button
$stopButton.Text = 'Zaustavi server'
$stopButton.Location = New-Object System.Drawing.Point(34, 210)
$stopButton.Size = New-Object System.Drawing.Size(386, 35)
$stopButton.FlatStyle = 'Flat'
$stopButton.BackColor = [System.Drawing.Color]::FromArgb(45, 52, 58)
$stopButton.ForeColor = [System.Drawing.Color]::White
$stopButton.Add_Click({
  if ($script:serverProcess -and -not $script:serverProcess.HasExited) {
    Stop-Process -Id $script:serverProcess.Id -Force
    Set-Status 'Status: server je zaustavljen' ([System.Drawing.Color]::FromArgb(184, 197, 213))
  } else {
    Set-Status 'Status: nema servera kojeg je launcher pokrenuo' ([System.Drawing.Color]::FromArgb(184, 197, 213))
  }
})
$form.Controls.Add($stopButton)

$form.Add_Shown({ if (Test-AppRunning) { Set-Status 'Status: aplikacija je već pokrenuta' ([System.Drawing.Color]::FromArgb(135, 214, 165)) } })
[void] $form.ShowDialog()
