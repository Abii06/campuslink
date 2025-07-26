# Test with image field to see if that was causing the 500 error
$API_BASE_URL = "http://localhost:5000/api"

Write-Host "Testing with image field..." -ForegroundColor Green

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
        
        # Test with images array (backend format)
        $testData = @{
            title = 'Test Item with Image'
            description = 'This is to test image handling'
            type = 'lost'
            category = 'electronics'
            itemName = 'Test Item with Image'
            location = 'Test Location'
            dateTime = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
            contactInfo = @{
                email = 'john@student.com'
            }
            images = @(
                @{
                    url = 'https://example.com/test-image.jpg'
                    filename = ''
                }
            )
        } | ConvertTo-Json -Depth 4
        
        Write-Host "Sending data with images array..." -ForegroundColor Yellow
        Write-Host $testData -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method POST -Body $testData -Headers $headers
        $responseData = $response.Content | ConvertFrom-Json
        
        if ($responseData.success) {
            Write-Host "SUCCESS with images array!" -ForegroundColor Green
            Write-Host "Item ID: $($responseData.data._id)" -ForegroundColor Cyan
        }
        
    } else {
        Write-Host "Login failed: $($loginData.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error details: $errorContent" -ForegroundColor Red
    }
}

Write-Host "Test completed!" -ForegroundColor Green