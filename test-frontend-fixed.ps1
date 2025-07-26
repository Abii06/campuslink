# Test the exact data structure that the frontend would send after fixes
$API_BASE_URL = "http://localhost:5000/api"

Write-Host "Testing fixed frontend data structure..." -ForegroundColor Green

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
        
        # This simulates the EXACT data structure after DataContext fixes
        $frontendFixedData = @{
            title = 'Fixed Frontend Test'
            description = 'Testing the fixed frontend data structure'
            type = 'lost'
            category = 'electronics'
            itemName = 'Fixed Frontend Test'  # Same as title
            location = 'Library 2nd Floor'
            dateTime = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
            contactInfo = @{
                email = 'john@student.com'
                # No phone field since frontend form doesn't collect it
            }
            images = @(
                @{
                    url = 'https://example.com/frontend-test.jpg'
                    filename = ''
                }
            )
            # Note: reportedBy and reportedById are NOT included (filtered out)
        } | ConvertTo-Json -Depth 4
        
        Write-Host "Sending fixed frontend data..." -ForegroundColor Yellow
        Write-Host $frontendFixedData -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method POST -Body $frontendFixedData -Headers $headers
        $responseData = $response.Content | ConvertFrom-Json
        
        if ($responseData.success) {
            Write-Host "SUCCESS! Fixed frontend data works!" -ForegroundColor Green
            Write-Host "Item ID: $($responseData.data._id)" -ForegroundColor Cyan
            Write-Host "Title: $($responseData.data.title)" -ForegroundColor Cyan
            Write-Host "Type: $($responseData.data.type)" -ForegroundColor Cyan
            Write-Host "Images: $($responseData.data.images.Count) image(s)" -ForegroundColor Cyan
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