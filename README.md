# 圖像辨識系統

基於 Flask 的現代化圖像辨識網站。

## 功能特點

- 📤 拖放式檔案上傳
- 👀 即時圖片預覽
- 🖼️ 支援多種圖片格式 (PNG, JPG, JPEG, GIF, RAW, DNG, BMP, TIFF, WEBP, SVG, HEIC, HEIF, AVIF)
- 📱 響應式設計，支援行動裝置
- ✨ 現代化使用者介面
- 🔄 平滑動畫效果
- ⚠️ 完善的錯誤提示
- 🔒 檔案大小限制保護
- 📝 檔案上傳結果

## 系統需求

- Python 3.8+
- Flask 3.0.0+
- 現代瀏覽器 (Chrome, Firefox, Safari, Edge)

## 技術規格

- 前端：HTML5, CSS3, JavaScript
- 後端：Flask (Python)
- 圖片處理：Pillow
- 檔案上傳：Werkzeug
- UI 框架：Bootstrap 5
- 圖示：Font Awesome 6

## 安裝步驟

### 🪟 Windows:

1. 克隆專案：
```bash
git clone https://github.com/canket/ImageRecognition.git
cd ImageRecognition
```

2. 安裝依賴：
```bash
pip install -r requirements.txt
```

3. 執行應用：
```bash
python app.py
```

4. 開啟瀏覽器訪問：
```
http://localhost:5000
```

### 🐧 Linux:

1. 克隆專案：
```bash
git clone https://github.com/canket/ImageRecognition.git
cd ImageRecognition
```

2. 安裝依賴：
```bash
pip install -r requirements.txt
```

3. 執行應用：
```bash
python app.py
```

4. 開啟瀏覽器訪問：
```
http://localhost:5000
```

###  🍎macOS:

1. 安裝 Homebrew（如果尚未安裝）：
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 安裝 Python（如果尚未安裝）：
```bash
brew install python@3.8
```

3. 克隆專案：
```bash
git clone https://github.com/canket/ImageRecognition.git
cd ImageRecognition
```

4. 安裝依賴：
```bash
pip3 install -r requirements.txt
```

5. 執行應用：
```bash
python3 app.py
```

6. 開啟瀏覽器訪問：
```
http://localhost:5000
```

## 使用指南

1. 上傳圖片：
   - 直接拖放圖片到上傳區域
   - 或點擊上傳區域選擇檔案
   
2. 預覽和確認：
   - 上傳後可立即預覽圖片
   - 系統會自動檢查檔案類型和大小
   
3. 開始辨識：
   - 確認圖片無誤後點擊「開始辨識」
   - 等待處理結果
   
4. 查看結果：
   - 系統會顯示辨識結果
   - 錯誤時會顯示明確的提示訊息

## 專案架構

```
ImageRecognition/
├── app.py                 # Flask 應用主程式
├── requirements.txt       # 專案依賴套件
├── README.md             # 專案說明文件
├── .gitignore            # Git 忽略檔案
├── static/               # 靜態資源目錄
│   ├── css/              # 儲存樣式表的目錄
│   │   └── styles.css    # 樣式表
│   ├── js/               # 儲存 JavaScript 腳本的目錄
│   │   └── scripts.js    # JavaScript 腳本
│   └── uploads/          # 上傳圖片暫存目錄
└── templates/            # 模板目錄
    └── index.html        # 主頁面模板
```

## 注意事項

- 📁 確保 uploads 資料夾具有適當的寫入權限
- 🖼️ 支援的圖片格式：PNG, JPG, JPEG, GIF, RAW, DNG, BMP, TIFF, WEBP, SVG, HEIC, HEIF, AVIF
- 💾 檔案大小限制：32MB
- 🌐 建議使用現代瀏覽器以獲得最佳體驗

## 錯誤處理

系統會處理以下情況：
- 不支援的檔案類型
- 檔案大小超過限制 (32MB)
- 檔案上傳失敗
- 處理過程錯誤

## 版本歷史

### 2025-01-01 (v0.0.1)
- ✨ 新增拖放上傳功能
- 🖼️ 添加圖片即時預覽
- 🎨 優化使用者介面設計
- 🐛 修復圖片上傳問題
- ⚡️ 改進錯誤處理機制

### 2025-01-01 (0.1.0)
- 🐛 修復檔案上傳問題
- ✨ 改進錯誤處理機制
- 📝 改進錯誤提示訊息
- 🎨 優化使用者介面

### 2025-01-02 (0.1.2)
- 🎨 優化使用者介面動畫效果
- 🔄 改進檔案上傳流程
- 🛡️ 增強圖片驗證機制
- 📱 改善行動裝置體驗
- ❎ 新增圖片刪除功能
- 📝 新增圖片辨識結果
- 🖼️ 增加 icon 圖示
- 🐛 修復拖放上傳問題

### 2025-01-03 (0.1.3)
- 🚀 提升圖像處理效能
- 🔍 優化辨識演算法
- 📊 新增統計分析功能
- 🎯 提高辨識準確度
- 💾 改進快取機制
- 🛠️ 更新核心依賴套件
- 🖼️ 增加圖片格式支援

## 維護指南

### 開發者注意事項
1. 新功能開發時更新 README.md
2. 保持 requirements.txt 最新
3. 遵循程式碼風格指南
4. 定期更新相依套件版本

### 版本控制
- 使用語意化版本號 (Semantic Versioning)
- 主要版本.次要版本.修補版本 (X.Y.Z)

## 授權 License

Copyright (c) 2024 canket

### 中文說明
本軟體採用修改版 MIT 授權條款。

您可以自由地：
- 修改本軟體的原始碼
- 散布本軟體
- 將本軟體再授權給他人

限制條件：
- 禁止商業用途
- 在所有副本中包含上述版權聲明和本授權聲明
- 不得移除或更改軟體中的作者署名

本軟體是"按原樣"提供，不提供任何明示或暗示的保證。

### English Version

Modified MIT License

Copyright (c) 2024 canket

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, except for commercial use, including the rights
to modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

- Commercial use is strictly prohibited
- The above copyright notice and this permission notice shall be included in all copies
- The original author attribution must not be removed or modified

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

## 作者 Author

**canket**
- GitHub: [https://github.com/canket]
- Email: [canket0820@gmail.com]

## 致謝 Acknowledgments

感謝所有對本專案做出貢獻的開發者。
Thanks to all contributors who participated in this project.