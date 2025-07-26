# Test the exact data structure that the frontend would send
$API_BASE_URL = "http://localhost:5000/api"

Write-Host "Testing Frontend Data Structure..." -ForegroundColor Green

# Step 1: Login to get token
Write-Host "`n1. Logging in..." -ForegroundColor Yellow
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
        
        # Step 2: Test with frontend-like data structure
        Write-Host "`n2. Testing with frontend data structure..." -ForegroundColor Yellow
        $headers = @{
            'Authorization' = "Bearer $token"
            'Content-Type' = 'application/json'
        }
        
        # This simulates what the frontend DataContext sends
        $frontendData = @{
            title = 'Test Frontend Item'
            description = 'This is a test item from frontend simulation'
            type = 'lost'
            category = 'electronics'
            itemName = 'Test Frontend Item'  # This should match title
            location = 'Library 1st Floor'
            dateTime = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
            contactInfo = @{
                email = 'john@student.com'
                # Note: no phone field since frontend form only has email
            }
        } | ConvertTo-Json -Depth 3
        
        Write-Host "Sending frontend-like data:" -ForegroundColor Cyan
        Write-Host $frontendData -ForegroundColor Gray
        
        $createResponse = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method POST -Body $frontendData -Headers $headers
        $createData = $createResponse.Content | ConvertFrom-Json
        
        if ($createData.success) {
            Write-Host "SUCCESS! Frontend data structure works!" -ForegroundColor Green
            Write-Host "Item ID: $($createData.data._id)" -ForegroundColor Cyan
        } else {
            Write-Host "FAILED: $($createData.message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "Login failed: $($loginData.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error details: $errorContent" -ForegroundColor Red
        
        # Try to parse error as JSON
        try {
            $errorJson = $errorContent | ConvertFrom-Json
            if ($errorJson.errors) {
                Write-Host "Validation errors:" -ForegroundColor Red
                foreach ($error in $errorJson.errors) {
                    Write-Host "  - $($error.msg): $($error.param)" -ForegroundColor Red
                }
            }
        } catch {
            # Error content is not JSON
        }
    }
}

Write-Host "`nTest completed!" -ForegroundColor Green