const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const themeToggle = document.getElementById('theme-toggle');

let currentValue = '0';
let previousValue = '';
let operator = '';
let shouldResetDisplay = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const number = button.dataset.number;
        const op = button.dataset.operator;

        if (number !== undefined) {
            handleNumber(number);
        } else if (op !== undefined) {
            handleOperator(op);
        } else if (action === 'clear') {
            clear();
        } else if (action === 'delete') {
            deleteLastDigit();
        } else if (action === 'equals') {
            calculate();
        }
    });
});

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

function handleNumber(num) {
    if (shouldResetDisplay) {
        currentValue = num;
        shouldResetDisplay = false;
    } else {
        if (num === '.' && currentValue.includes('.')) return;
        currentValue = currentValue === '0' ? num : currentValue + num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    previousValue = currentValue;
    operator = op;
    shouldResetDisplay = true;
}

function calculate() {
    if (!operator || !previousValue) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : 'Error';
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    currentValue = result.toString();
    operator = '';
    previousValue = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clear() {
    currentValue = '0';
    previousValue = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLastDigit() {
    if (currentValue.length === 1) {
        currentValue = '0';
    } else {
        currentValue = currentValue.slice(0, -1);
    }
    updateDisplay();
}

function updateDisplay() {
    display.textContent = currentValue;
}
