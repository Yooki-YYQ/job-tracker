# Simple Debug Test
Write-Host "Simple debug test to see what backend receives..."

try {
    # Get first application ID
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    $firstApp = $data[0]
    $appId = $firstApp.id
    Write-Host "Testing with app ID: $appId"
    
    # Test with OLD format
    Write-Host "`nSending OLD format:"
    $oldFormat = @{
        data = @{
            companyName = "Debug Test"
            positionTitle = "Debug Position"
        }
    }
    
    $jsonBody = $oldFormat | ConvertTo-Json -Depth 3
    Write-Host "JSON body being sent:"
    Write-Host $jsonBody
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body $jsonBody -ContentType "application/json" -UseBasicParsing
        Write-Host "Response Status: $($response.StatusCode)"
        Write-Host "Response Content: $($response.Content)"
    } catch {
        Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
        $errorContent = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorContent)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error Content: $errorText"
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}


