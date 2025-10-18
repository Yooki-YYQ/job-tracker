# Test Character Array Bug Fix
Write-Host "Testing character array bug fix..."

try {
    # Get first application ID
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    $firstApp = $data[0]
    $appId = $firstApp.id
    Write-Host "Testing with app ID: $appId"
    
    # Test 1: Try OLD format (should be rejected)
    Write-Host "`nTest 1: Trying OLD format (should be rejected)..."
    $oldFormat = @{
        data = @{
            companyName = "Test Company"
            positionTitle = "Test Position"
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $oldResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body $oldFormat -ContentType "application/json" -UseBasicParsing
        Write-Host "❌ FAILED: Old format was accepted (should have been rejected)"
        Write-Host "Status: $($oldResponse.StatusCode)"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "✅ SUCCESS: Old format correctly rejected with 400 error"
            $errorContent = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorContent)
            $errorText = $reader.ReadToEnd()
            Write-Host "Error message: $errorText"
        } else {
            Write-Host "❌ FAILED: Unexpected error: $($_.Exception.Message)"
        }
    }
    
    # Test 2: Try NEW format (should be accepted)
    Write-Host "`nTest 2: Trying NEW format (should be accepted)..."
    $newFormat = @{
        companyName = "Test Company New"
        positionTitle = "Test Position New"
        jobDescription = "This is a test description"
    } | ConvertTo-Json -Depth 3
    
    try {
        $newResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body $newFormat -ContentType "application/json" -UseBasicParsing
        Write-Host "✅ SUCCESS: New format accepted"
        Write-Host "Status: $($newResponse.StatusCode)"
        
        # Check if data is stored correctly (not as character array)
        $updatedData = $newResponse.Content | ConvertFrom-Json
        Write-Host "Updated data structure:"
        Write-Host "Company: $($updatedData.data.companyName)"
        Write-Host "Position: $($updatedData.data.positionTitle)"
        Write-Host "Job Description: $($updatedData.data.jobDescription)"
        
        # Check for character array bug
        if ($updatedData.data."0" -ne $null) {
            Write-Host "❌ FAILED: Character array bug still exists!"
            Write-Host "Data has numeric keys: $($updatedData.data."0")"
        } else {
            Write-Host "✅ SUCCESS: No character array bug - data stored correctly"
        }
        
    } catch {
        Write-Host "❌ FAILED: New format was rejected: $($_.Exception.Message)"
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}


