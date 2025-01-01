# 圖像辨識系統 (Image Recognition System)

這是一個使用 Python Flask 建立的圖像辨識網頁應用程式，能夠上傳圖片並進行辨識分析。

## 功能特點

- 圖片上傳和預覽
- 即時圖像辨識
- 響應式網頁設計
- 使用者友善界面

## 技術架構

- 後端：Python Flask
- 前端：HTML5, CSS3, JavaScript
- UI 框架：Bootstrap 5
- 圖像處理：OpenCV

## 專案結構
架構專案目錄/
├── app.py # Flask 應用程式主文件
├── templates/ # HTML 模板
│ └── index.html # 主頁面
├── static/ # 靜態資源
│ ├── css/ # CSS 樣式
│ │ └── styles.css
│ ├── js/ # JavaScript 文件
│ │ └── scripts.js
│ └── images/ # 圖片資源
│ └── example.jpg
└── README.md # 專案說明文件

## 安裝說明

1. 克隆專案到本地

bash

git clone https://github.com/your-username/image-recognition.git
cd image-recognition

2. 安裝相依套件

bash

pip install -r requirements.txt

3. 運行 Flask 應用程式

bash

python app.py

4. 在瀏覽器中訪問 http://localhost:5000 即可使用

