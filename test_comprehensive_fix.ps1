# Comprehensive Test for Character Array Bug Fix
Write-Host "Testing comprehensive character array bug fix..."

try {
    # Get first application ID
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    $firstApp = $data[0]
    $appId = $firstApp.id
    Write-Host "Testing with app ID: $appId"
    
    # Test 1: OLD format (should be rejected)
    Write-Host "`n=== Test 1: OLD format (should be rejected) ==="
    $oldFormat = @{
        data = @{
            companyName = "Old Format Test"
            positionTitle = "Old Position"
        }
    }
    
    try {
        $oldResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body ($oldFormat | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
        Write-Host "❌ FAILED: Old format was accepted (Status: $($oldResponse.StatusCode))"
        
        # Check for character array bug
        $responseData = $oldResponse.Content | ConvertFrom-Json
        if ($responseData.data."0" -ne $null) {
            Write-Host "❌ CRITICAL: Character array bug still exists!"
        } else {
            Write-Host "✅ No character array bug detected"
        }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "✅ SUCCESS: Old format correctly rejected"
            $errorContent = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorContent)
            $errorText = $reader.ReadToEnd()
            Write-Host "Error message: $errorText"
        } else {
            Write-Host "❌ FAILED: Unexpected error: $($_.Exception.Message)"
        }
    }
    
    # Test 2: NEW format (should be accepted)
    Write-Host "`n=== Test 2: NEW format (should be accepted) ==="
    $newFormat = @{
        companyName = "New Format Test"
        positionTitle = "New Position"
        jobDescription = "This is a test description for new format"
    }
    
    try {
        $newResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body ($newFormat | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
        Write-Host "✅ SUCCESS: New format accepted (Status: $($newResponse.StatusCode))"
        
        # Check for character array bug
        $responseData = $newResponse.Content | ConvertFrom-Json
        if ($responseData.data."0" -ne $null) {
            Write-Host "❌ CRITICAL: Character array bug still exists in new format!"
            Write-Host "Data has numeric keys: $($responseData.data."0")"
        } else {
            Write-Host "✅ SUCCESS: No character array bug - data stored correctly"
            Write-Host "Company: $($responseData.data.companyName)"
            Write-Host "Position: $($responseData.data.positionTitle)"
            Write-Host "Description: $($responseData.data.jobDescription)"
        }
    } catch {
        Write-Host "❌ FAILED: New format was rejected: $($_.Exception.Message)"
    }
    
    # Test 3: String format (should be rejected)
    Write-Host "`n=== Test 3: String format (should be rejected) ==="
    $stringFormat = '{"companyName": "String Test", "positionTitle": "String Position"}'
    
    try {
        $stringResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/applications/$appId" -Method PUT -Body $stringFormat -ContentType "application/json" -UseBasicParsing
        Write-Host "❌ FAILED: String format was accepted (Status: $($stringResponse.StatusCode))"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "✅ SUCCESS: String format correctly rejected"
        } else {
            Write-Host "❌ FAILED: Unexpected error: $($_.Exception.Message)"
        }
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}


