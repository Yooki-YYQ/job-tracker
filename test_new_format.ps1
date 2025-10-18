# Test NEW format (should be accepted)
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
$firstApp = $data[0]
$appId = $firstApp.id

$newFormatData = @{
    companyName = "New Format Company"
    positionTitle = "New Format Position"
    jobDescription = "This is a new job description."
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body $newFormatData -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ SUCCESS: New format accepted (Status: $($response.StatusCode))" -ForegroundColor Green
    $updatedApp = $response.Content | ConvertFrom-Json
    Write-Host "Updated data structure:"
    Write-Host "Company: $($updatedApp.data.companyName)"
    Write-Host "Position: $($updatedApp.data.positionTitle)"
    
    # Verify no character array bug
    if ($updatedApp.data."0" -ne $null) {
        Write-Host "❌ FAILED: Character array bug still exists!" -ForegroundColor Red
    } else {
        Write-Host "✅ SUCCESS: No character array bug detected." -ForegroundColor Green
    }
} catch {
    Write-Host "❌ FAILED: New format was rejected: $($_.Exception.Message)" -ForegroundColor Red
}