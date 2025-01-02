document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const submitBtn = document.getElementById('submitBtn');
    const deleteButton = document.getElementById('deleteButton');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let currentFileName = '';
    let selectedFile = null;

    function showLoading(show = true) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    function showMessage(message, isError = false) {
        const messageAlert = document.getElementById('messageAlert');
        messageAlert.textContent = message;
        messageAlert.className = `alert ${isError ? 'alert-danger' : 'alert-success'} fade-in`;
        messageAlert.style.display = 'block';
        
        setTimeout(() => {
            messageAlert.classList.add('fade-out');
            setTimeout(() => {
                messageAlert.style.display = 'none';
                messageAlert.classList.remove('fade-out');
            }, 500);
        }, 4000);
    }

    window.addEventListener('error', function(e) {
        console.error('全局錯誤:', e.error);
        showMessage('發生錯誤，請重新整理頁面', true);
    });

    function isValidImageFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return validTypes.includes(file.type);
    }

    async function handleFileSelect(file) {
        if (!isValidImageFile(file)) {
            showMessage('請上傳 JPG、PNG 或 GIF 格式的圖片', true);
            return;
        }

        if (file.size > 16 * 1024 * 1024) {
            showMessage('檔案大小超過 16MB 限制！', true);
            return;
        }

        selectedFile = file;

        dropZone.style.transition = 'all 0.3s ease';
        dropZone.style.opacity = '0';
        dropZone.style.transform = 'scale(0.9)';

        setTimeout(() => {
            dropZone.style.display = 'none';
            
            previewImage.src = URL.createObjectURL(file);
            previewContainer.style.display = 'block';
            previewContainer.style.opacity = '0';
            previewContainer.style.transform = 'scale(0.8)';
            
            requestAnimationFrame(() => {
                previewContainer.style.transition = 'all 0.3s ease';
                previewContainer.style.opacity = '1';
                previewContainer.style.transform = 'scale(1)';
            });
            
            submitBtn.disabled = false;
        }, 300);
    }

    async function handleRecognition() {
        if (!selectedFile) {
            showMessage('請先選擇圖片', true);
            return;
        }

        try {
            showLoading(true);

            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message);
            }

            currentFileName = result.filename;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const resultHtml = `
                <div class="result-container fade-in">
                    <div class="result-image-container">
                        <img src="${URL.createObjectURL(selectedFile)}" 
                             alt="已上傳圖片" 
                             class="result-image">
                    </div>
                    <div class="result-text mt-4">
                        <h3 class="text-center mb-3">辨識結果</h3>
                        <div class="result-box">
                            <p class="lead text-center">測試</p>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                        <button type="button" 
                                class="btn btn-primary btn-lg" 
                                onclick="window.location.reload()">
                            <i class="fas fa-redo me-2"></i>重新上傳
                        </button>
                    </div>
                </div>
            `;

            const uploadArea = document.querySelector('.upload-area');
            uploadArea.style.opacity = '0';
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            uploadArea.innerHTML = resultHtml;
            uploadArea.style.opacity = '1';
            
        } catch (error) {
            showMessage(error.message || '辨識過程發生錯誤', true);
        } finally {
            showLoading(false);
        }
    }

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        } else {
            showMessage('請拖放圖片檔案！', true);
        }
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        } else if (file) {
            showMessage('請選擇圖片檔案！', true);
        }
    });

    deleteButton.onclick = async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (currentFileName) {
            if (!currentFileName) {
                showMessage('無法刪除檔案：檔案名稱未知', true);
                return;
            }
            
            previewContainer.style.transition = 'all 0.3s ease';
            previewContainer.style.transform = 'scale(0.8) rotate(-10deg)';
            previewContainer.style.opacity = '0';
            
            try {
                showLoading(true);
                const response = await fetch('/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: currentFileName })
                });
                
                const result = await response.json();
                if (result.success) {
                    setTimeout(() => {
                        previewContainer.style.display = 'none';
                        previewImage.src = '';
                        fileInput.value = '';
                        submitBtn.disabled = true;
                        currentFileName = '';
                        
                        dropZone.style.display = 'flex';
                        dropZone.style.opacity = '0';
                        dropZone.style.transform = 'scale(0.9)';
                        
                        setTimeout(() => {
                            dropZone.style.transition = 'all 0.3s ease';
                            dropZone.style.opacity = '1';
                            dropZone.style.transform = 'scale(1)';
                        }, 50);
                        
                        showMessage('圖片已刪除');
                    }, 300);
                } else {
                    showMessage(result.message, true);
                    previewContainer.style.transform = 'scale(1)';
                    previewContainer.style.opacity = '1';
                }
            } catch (error) {
                showMessage('刪除過程中發生錯誤', true);
                previewContainer.style.transform = 'scale(1)';
                previewContainer.style.opacity = '1';
            } finally {
                showLoading(false);
            }
        } else {
            previewContainer.style.transition = 'all 0.3s ease';
            previewContainer.style.transform = 'scale(0.8) rotate(-10deg)';
            previewContainer.style.opacity = '0';
            
            setTimeout(() => {
                previewContainer.style.display = 'none';
                previewImage.src = '';
                fileInput.value = '';
                selectedFile = null;
                submitBtn.disabled = true;
                
                dropZone.style.display = 'flex';
                dropZone.style.opacity = '0';
                dropZone.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    dropZone.style.transition = 'all 0.3s ease';
                    dropZone.style.opacity = '1';
                    dropZone.style.transform = 'scale(1)';
                }, 50);
            }, 300);
        }
    };

    submitBtn.addEventListener('click', handleRecognition);
});

function testUpload() {
    const file = fileInput.files[0];
    console.log('選擇的檔案:', file);
}

function handleError(error, message) {
    console.error(error);
    showMessage(message, true);
    showLoading(false);
}
