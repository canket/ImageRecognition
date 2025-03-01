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
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/heif'];
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'heif'];
        
        // 檢查副檔名
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop();
        const hasValidExtension = validExtensions.includes(fileExtension);
        
        // 檢查 MIME 類型
        const hasValidMimeType = validTypes.includes(file.type);
        
        // 如果副檔名符合就允許，不管 MIME 類型
        return hasValidExtension;
    }

    async function convertToJpeg(file) {
        return new Promise(async (resolve, reject) => {
            try {
                // 檢查是否為 HEIC 格式
                const isHeic = file.name.toLowerCase().endsWith('.heic');
                
                // 如果是 HEIC，先轉換為 JPEG blob
                let processedFile = file;
                if (isHeic) {
                    try {
                        const blob = await heic2any({
                            blob: file,
                            toType: 'image/jpeg',
                            quality: 0.92
                        });
                        processedFile = new File([blob], 
                            file.name.split('.')[0] + '.jpg',
                            { type: 'image/jpeg' }
                        );
                    } catch (heicError) {
                        console.error('HEIC 轉換錯誤:', heicError);
                        throw new Error('HEIC 圖片轉換失敗');
                    }
                }

                // 繼續處理圖片（轉換為指定大小的 JPEG）
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        
                        canvas.toBlob((blob) => {
                            const convertedFile = new File([blob], 
                                file.name.split('.')[0] + '.jpg',
                                { type: 'image/jpeg' }
                            );
                            resolve(convertedFile);
                        }, 'image/jpeg', 0.92);
                    };
                    img.onerror = function() {
                        reject(new Error('圖片載入失敗'));
                    };
                    img.src = e.target.result;
                };
                reader.onerror = function() {
                    reject(new Error('檔案讀取失敗'));
                };
                reader.readAsDataURL(processedFile);
            } catch (error) {
                reject(error);
            }
        });
    }

    async function handleFileSelect(file) {
        if (!isValidImageFile(file)) {
            showMessage('請上傳 JPG、PNG、GIF、HEIC 或 HEIF 格式的圖片', true);
            return;
        }

        if (file.size > 16 * 1024 * 1024) {
            showMessage('檔案大小超過 16MB 限制！', true);
            return;
        }

        try {
            showLoading(true);
            // 轉換圖片為 JPEG 格式
            const convertedFile = await convertToJpeg(file);
            selectedFile = convertedFile;

            dropZone.style.transition = 'all 0.3s ease';
            dropZone.style.opacity = '0';
            dropZone.style.transform = 'scale(0.9)';

            setTimeout(() => {
                dropZone.style.display = 'none';
                
                previewImage.src = URL.createObjectURL(convertedFile);
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
        } catch (error) {
            console.error('圖片轉換錯誤:', error);
            showMessage('圖片處理過程發生錯誤', true);
        } finally {
            showLoading(false);
        }
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
                            <div class="row">
                                <div class="col-md-8 mx-auto">
                                    <canvas id="resultChart"></canvas>
                                </div>
                            </div>
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

            // 建立圓餅圖
            const ctx = document.getElementById('resultChart').getContext('2d');
            Chart.register(ChartDataLabels);
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['T1', 'T2', 'T3'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: [
                            'rgb(255, 182, 193)',  // 淺粉紅
                            'rgb(135, 206, 235)',  // 淺藍色
                            'rgb(255, 218, 121)'   // 淺黃色
                        ],
                        borderWidth: 1,
                        borderColor: [
                            'rgb(255, 182, 193)',
                            'rgb(135, 206, 235)',
                            'rgb(255, 218, 121)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 2000,
                        easing: 'easeOutQuart'
                    },
                    layout: {
                        padding: {
                            top: 40,
                            right: 100,
                            bottom: 40,
                            left: 40
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        },
                        datalabels: {
                            color: '#333',
                            font: {
                                size: 14
                            },
                            formatter: (value, context) => {
                                return 't' + (context.dataIndex + 1) + ' ' + value + '%';
                            },
                            align: function(context) {
                                const value = context.dataset.data[context.dataIndex];
                                return value > 30 ? 'end' : 'end';
                            },
                            anchor: function(context) {
                                const value = context.dataset.data[context.dataIndex];
                                return value > 30 ? 'end' : 'end';
                            },
                            offset: 0,
                            textAlign: 'left',
                            listeners: {
                                afterDraw: function(context) {
                                    const {ctx, dataIndex} = context;
                                    const meta = context.chart.getDatasetMeta(0);
                                    const center = meta.data[dataIndex].center;
                                    const angle = meta.data[dataIndex].startAngle + (meta.data[dataIndex].endAngle - meta.data[dataIndex].startAngle) / 2;
                                    
                                    // 計算起點
                                    const radius = meta.data[dataIndex].outerRadius;
                                    const startX = center.x + Math.cos(angle) * radius;
                                    const startY = center.y + Math.sin(angle) * radius;
                                    
                                    // 繪製指示線
                                    ctx.save();
                                    ctx.beginPath();
                                    ctx.moveTo(startX, startY);
                                    ctx.lineTo(startX + 30, startY);
                                    ctx.lineTo(startX + 30, context.y);
                                    ctx.strokeStyle = '#666';
                                    ctx.lineWidth = 1;
                                    ctx.stroke();
                                    ctx.restore();
                                }
                            }
                        }
                    }
                }
            });
            
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
        if (file) {
            handleFileSelect(file);
        } else {
            showMessage('請拖放圖片檔案！', true);
        }
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            handleFileSelect(file);
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
