document.addEventListener('DOMContentLoaded', function() {
    function init() {
        // 獲取必要的 DOM 元素
        const uploadForm = document.getElementById('upload-form');
        const imageInput = document.getElementById('image-input');
        const previewImage = document.getElementById('preview-image');
        const resultContainer = document.getElementById('result-container');
        const loadingSpinner = document.getElementById('loading-spinner');

        // 圖片預覽功能
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });

        // 處理表單提交
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 顯示載入動畫
            loadingSpinner.style.display = 'block';
            resultContainer.innerHTML = '';

            // 準備表單數據
            const formData = new FormData(uploadForm);

            try {
                // 發送 AJAX 請求
                const response = await fetch('/analyze', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('網路回應不正常');
                }

                const data = await response.json();
                
                // 顯示結果
                displayResults(data);

            } catch (error) {
                console.error('錯誤:', error);
                resultContainer.innerHTML = `
                    <div class="error-message">
                        處理過程中發生錯誤：${error.message}
                    </div>
                `;
            } finally {
                // 隱藏載入動畫
                loadingSpinner.style.display = 'none';
            }
        });

        // 顯示辨識結果
        function displayResults(data) {
            resultContainer.innerHTML = `
                <div class="results">
                    <h3>辨識結果：</h3>
                    <ul>
                        ${data.results.map(result => `
                            <li>
                                <span class="label">${result.label}</span>
                                <span class="confidence">${(result.confidence * 100).toFixed(2)}%</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
    }

    init();
});
