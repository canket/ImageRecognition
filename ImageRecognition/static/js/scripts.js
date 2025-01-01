// 確保這段 JavaScript 正確執行
document.addEventListener('DOMContentLoaded', function() {
    // 獲取元素
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const submitBtn = document.getElementById('submitBtn');
    const messageAlert = document.getElementById('messageAlert');

    // 檢查元素是否存在
    if (!form || !fileInput || !dropZone || !previewContainer || !previewImage || !submitBtn || !messageAlert) {
        console.error('找不到必要的 DOM 元素');
        return;
    }

    // Debug 用的日誌
    console.log('JavaScript 已載入');

    // 檔案上傳處理
    form.onsubmit = async function(e) {
        e.preventDefault();
        console.log('表單提交');

        try {
            const formData = new FormData(this);
            
            // 檢查是否有檔案
            if (!formData.has('image')) {
                throw new Error('請選擇檔案');
            }

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '上傳失敗');
            }

            showMessage(data.message);
            console.log('上傳成功:', data);

        } catch (error) {
            showMessage(error.message, true);
            console.error('上傳錯誤:', error);
        }
    };

    // 其他事件處理器保持不變...
});

// 測試用的函數
function testUpload() {
    const file = fileInput.files[0];
    console.log('選擇的檔案:', file);
}