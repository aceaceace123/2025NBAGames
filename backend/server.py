import os
import uvicorn

if __name__ == "__main__":
    # 取得可能在環境變量中的端口
    port = int(os.environ.get("PORT", 8000))
    
    # 啟動伺服器
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
    
    print(f"Server running on port {port}")
    print("API文檔： http://localhost:{port}/docs")
    print("交互式API文檔：http://localhost:{port}/redoc") 