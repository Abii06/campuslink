# Test if the frontend authentication is working
$API_BASE_URL = "http://localhost:5000/api"

Write-Host "Testing frontend authentication..." -ForegroundColor Green

# First, let's check what happens when we try to access the lost-found endpoint without auth
Write-Host "`n1. Testing without authentication..." -ForegroundColor Yellow
try {
    $noAuthResponse = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method GET
    Write-Host "Unexpected success without auth" -ForegroundColor Red
} catch {
    Write-Host "Expected: No auth error - $($_.Exception.Message)" -ForegroundColor Green
}

# Now test with authentication
Write-Host "`n2. Testing with authentication..." -ForegroundColor Yellow
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
        Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Cyan
        
        # Test accessing protected endpoint
        $headers = @{
            'Authorization' = "Bearer $token"
            'Content-Type' = 'application/json'
        }
        
        $authResponse = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method GET -Headers $headers
        $authData = $authResponse.Content | ConvertFrom-Json
        
        Write-Host "Authenticated request successful!" -ForegroundColor Green
        Write-Host "Found $($authData.data.Count) items" -ForegroundColor Cyan
        
        # Test the /auth/me endpoint to verify token
        Write-Host "`n3. Testing current user endpoint..." -ForegroundColor Yellow
        $meResponse = Invoke-WebRequest -Uri "$API_BASE_URL/auth/me" -Method GET -Headers $headers
        $meData = $meResponse.Content | ConvertFrom-Json
        
        if ($meData.success) {
            Write-Host "Current user verified!" -ForegroundColor Green
            Write-Host "User: $($meData.user.name) ($($meData.user.email))" -ForegroundColor Cyan
            Write-Host "Role: $($meData.user.role)" -ForegroundColor Cyan
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
    }
}

Write-Host "`nAuth test completed!" -ForegroundColor Green