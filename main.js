const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingProgress = document.getElementById('loading-progress');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const actionButtons = document.getElementById('action-buttons');
const printBtn = document.getElementById('print-btn');
const resetBtn = document.getElementById('reset-btn');
const themeToggle = document.getElementById('theme-toggle');

// 테마 토글 이벤트
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// 파일 선택 이벤트
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// 드래그앤드롭 이벤트
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    } else {
        alert('이미지 파일만 업로드할 수 있습니다.');
    }
});

// 프린트 버튼 이벤트
printBtn.addEventListener('click', printText);

// 초기화 버튼 이벤트
resetBtn.addEventListener('click', resetAll);

// 이미지 업로드 처리
function handleImageUpload(file) {
    // 파일이 이미지인지 확인
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
    }

    // 이미지 미리보기 표시
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
        uploadArea.style.display = 'none';

        // OCR 처리 시작
        processOCR(file);
    };
    reader.readAsDataURL(file);
}

// OCR 처리
async function processOCR(imageFile) {
    // 로딩 표시
    loadingIndicator.style.display = 'block';
    resultContainer.style.display = 'none';
    actionButtons.style.display = 'none';

    try {
        const result = await Tesseract.recognize(
            imageFile,
            'kor+eng', // 한글+영문 동시 인식
            {
                logger: (m) => {
                    // 진행률 업데이트
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        loadingProgress.textContent = `${progress}%`;
                    }
                }
            }
        );

        // 결과 표시
        displayResult(result.data.text);
    } catch (error) {
        console.error('OCR Error:', error);
        alert('텍스트 추출에 실패했습니다. 다시 시도해주세요.');
        resetAll();
    }
}

// 추출된 텍스트 표시
function displayResult(text) {
    loadingIndicator.style.display = 'none';

    if (!text || text.trim() === '') {
        alert('추출된 텍스트가 없습니다. 다른 이미지를 시도해주세요.');
        return;
    }

    resultText.value = text;
    resultContainer.style.display = 'block';
    actionButtons.style.display = 'flex';
}

// 텍스트 프린트
function printText() {
    const text = resultText.value;

    if (!text || text.trim() === '') {
        alert('프린트할 텍스트가 없습니다.');
        return;
    }

    // 새 창에서 프린트
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>OCR 결과 프린트</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    line-height: 1.6;
                }
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-family: inherit;
                }
            </style>
        </head>
        <body>
            <h1>추출된 텍스트</h1>
            <pre>${text}</pre>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    // 프린트 대화상자 표시
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// 전체 초기화
function resetAll() {
    // 입력 초기화
    fileInput.value = '';
    previewImage.src = '';
    resultText.value = '';

    // UI 초기화
    uploadArea.style.display = 'block';
    previewContainer.style.display = 'none';
    loadingIndicator.style.display = 'none';
    resultContainer.style.display = 'none';
    actionButtons.style.display = 'none';
    loadingProgress.textContent = '0%';
}
