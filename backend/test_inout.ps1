$postData = @{
  consumableId = "CON1766493042245"
  type = "in"
  quantity = 5
  operator = "测试管理员"
  reason = "测试入库"
  notes = "测试日志记录功能"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/consumables/quick-inout" -Method Post -Body $postData -ContentType "application/json"

Write-Host "入库API响应:"
$response | ConvertTo-Json -Depth 5
