# Debug Backend - Test what's actually being received
Write-Host "Debugging backend request format..."

try {
    # Get first application ID
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    $firstApp = $data[0]
    $appId = $firstApp.id
    Write-Host "Testing with app ID: $appId"
    
    # Test OLD format with detailed logging
    Write-Host "`nTesting OLD format with detailed logging..."
    $oldFormat = @{
        data = @{
            companyName = "Debug Test Company"
            positionTitle = "Debug Test Position"
        }
    }
    
    Write-Host "Sending OLD format:"
    Write-Host ($oldFormat | ConvertTo-Json -Depth 3)
    
    try {
        $oldResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body ($oldFormat | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
        Write-Host "❌ OLD format was accepted (Status: $($oldResponse.StatusCode))"
        Write-Host "Response: $($oldResponse.Content)"
    } catch {
        Write-Host "✅ OLD format was rejected"
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        $errorContent = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorContent)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error response: $errorText"
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}


