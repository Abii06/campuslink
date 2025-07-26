# Test to trigger the 500 error and see backend logs
$API_BASE_URL = "http://localhost:5000/api"

Write-Host "Testing to trigger 500 error..." -ForegroundColor Green

# Login first
$loginBody = @{
    email = 'john@student.com'
    password = 'student123'
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$API_BASE_URL/auth/login" -Method POST -Body $loginBody -ContentType 'application/json'
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.success) {
        Write-Host "Login successful!" -ForegroundColor Green
        $token = $loginData.token
        
        $headers = @{
            'Authorization' = "Bearer $token"
            'Content-Type' = 'application/json'
        }
        
        # Send data that might cause the 500 error
        $testData = @{
            title = 'Debug Test Item'
            description = 'This is to debug the 500 error'
            type = 'lost'
            category = 'electronics'
            itemName = 'Debug Test Item'
            location = 'Debug Location'
            dateTime = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
            contactInfo = @{
                email = 'john@student.com'
            }
        } | ConvertTo-Json -Depth 3
        
        Write-Host "Sending test data to trigger error..." -ForegroundColor Yellow
        Write-Host $testData -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method POST -Body $testData -Headers $headers
        $responseData = $response.Content | ConvertFrom-Json
        
        Write-Host "Unexpected success: $($responseData.message)" -ForegroundColor Green
        
    } else {
        Write-Host "Login failed: $($loginData.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Expected error occurred: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Check the backend console for detailed logs" -ForegroundColor Cyan
}

Write-Host "Test completed - check backend logs!" -ForegroundColor Green