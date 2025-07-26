# Test API connectivity and lost found creation
$API_BASE_URL = "http://localhost:5000/api"

Write-Host "Testing Lost Found API..." -ForegroundColor Green

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
        Write-Host "✅ Login successful!" -ForegroundColor Green
        $token = $loginData.token
        Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Cyan
        
        # Step 2: Test getting existing lost found items
        Write-Host "`n2. Getting existing lost found items..." -ForegroundColor Yellow
        $headers = @{
            'Authorization' = "Bearer $token"
            'Content-Type' = 'application/json'
        }
        
        $getResponse = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method GET -Headers $headers
        $existingItems = $getResponse.Content | ConvertFrom-Json
        Write-Host "✅ Found $($existingItems.data.Count) existing items" -ForegroundColor Green
        
        # Step 3: Create a new lost found item
        Write-Host "`n3. Creating new lost found item..." -ForegroundColor Yellow
        $newItemBody = @{
            title = 'Test Lost Phone'
            description = 'A black iPhone 13 with a blue case'
            type = 'lost'
            category = 'electronics'
            itemName = 'Test Lost Phone'
            location = 'Library 2nd Floor'
            dateTime = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
            contactInfo = @{
                email = 'john@student.com'
                phone = '9876543210'
            }
        } | ConvertTo-Json -Depth 3
        
        Write-Host "Sending data:" -ForegroundColor Cyan
        Write-Host $newItemBody -ForegroundColor Gray
        
        $createResponse = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method POST -Body $newItemBody -Headers $headers
        $createData = $createResponse.Content | ConvertFrom-Json
        
        if ($createData.success) {
            Write-Host "✅ Lost found item created successfully!" -ForegroundColor Green
            Write-Host "Item ID: $($createData.data._id)" -ForegroundColor Cyan
            Write-Host "Title: $($createData.data.title)" -ForegroundColor Cyan
            Write-Host "Type: $($createData.data.type)" -ForegroundColor Cyan
            Write-Host "Status: $($createData.data.status)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Failed to create item: $($createData.message)" -ForegroundColor Red
        }
        
        # Step 4: Verify the item was saved by getting all items again
        Write-Host "`n4. Verifying item was saved..." -ForegroundColor Yellow
        $verifyResponse = Invoke-WebRequest -Uri "$API_BASE_URL/lost-found" -Method GET -Headers $headers
        $updatedItems = $verifyResponse.Content | ConvertFrom-Json
        Write-Host "✅ Now found $($updatedItems.data.Count) items (should be +1)" -ForegroundColor Green
        
    } else {
        Write-Host "❌ Login failed: $($loginData.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error details: $errorContent" -ForegroundColor Red
    }
}

Write-Host "`nTest completed!" -ForegroundColor Green