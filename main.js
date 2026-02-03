const generateBtn = document.getElementById('generate-btn');
const numberElements = document.querySelectorAll('.number');

generateBtn.addEventListener('click', () => {
    const lottoNumbers = generateLottoNumbers();
    displayLottoNumbers(lottoNumbers);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayLottoNumbers(numbers) {
    numberElements.forEach((element, index) => {
        element.textContent = numbers[index];
    });
}
