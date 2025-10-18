# Delete Test Data Script
Write-Host "Starting test data deletion..."

try {
    # Get all applications
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/applications" -UseBasicParsing
    $apps = $response.Content | ConvertFrom-Json
    
    Write-Host "Total applications found: $($apps.Count)"
    
    # Find test records (character array bug OR Debug text)
    $testRecords = $apps | Where { 
        $_.data."0" -ne $null -or 
        $_.data.companyName -like "*Debug*" -or
        $_.data.positionTitle -like "*Debug*"
    }
    
    Write-Host "Test records found: $($testRecords.Count)"
    
    if ($testRecords.Count -eq 0) {
        Write-Host "No test records to delete."
        exit 0
    }
    
    # Delete each test record
    foreach ($record in $testRecords) {
        Write-Host "Deleting record: $($record.id) - Company: $($record.data.companyName)"
        try {
            $deleteResponse = Invoke-WebRequest -Method DELETE "http://localhost:5000/api/applications/$($record.id)" -UseBasicParsing
            Write-Host "Successfully deleted: $($record.id)"
        } catch {
            Write-Host "Failed to delete $($record.id): $($_.Exception.Message)"
        }
    }
    
    Write-Host "Test data deletion complete!"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    exit 1
}
