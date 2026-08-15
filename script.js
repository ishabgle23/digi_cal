// ================================
// HISTORY ARRAY
// Stores all past calculations
// ================================
let historyArray = [];


// ================================
// appendValue Function
// Adds number/symbol to screen
// ================================
function appendValue(value) {

    let screen = document.getElementById('screen');
    let currentValue = screen.value;
    let operators = ['+', '-', '*', '/', '%'];
    let lastChar = currentValue.slice(-1);

    // Replace operator with new operator
    if(operators.includes(lastChar) && operators.includes(value)) {
        screen.value = currentValue.slice(0, -1) + value;
        return;
    }

    // Prevent starting with operator except minus
    if(currentValue === '' && operators.includes(value) && value !== '-') {
        return;
    }

    // Prevent double decimal
    if(value === '.') {
        let parts = currentValue.split(/[\+\-\*\/]/);
        let lastPart = parts[parts.length - 1];
        if(lastPart.includes('.')) {
            return;
        }
    }

    // Add value to screen
    screen.value += value;

    // Update expression display
    updateExpression(screen.value);
}


// ================================
// updateExpression Function
// Shows expression above answer
// ================================
function updateExpression(value) {
    let expressionDiv = document.getElementById('expression');
    if(expressionDiv) {
        expressionDiv.textContent = value;
    }
}


// ================================
// clearScreen Function
// ================================
function clearScreen() {
    let screen = document.getElementById('screen');
    screen.value = '';

    // Clear expression too
    updateExpression('');

    // Animate screen
    screen.style.opacity = '0.5';
    setTimeout(() => { screen.style.opacity = '1'; }, 150);
}


// ================================
// deleteLast Function
// ================================
function deleteLast() {
    let screen = document.getElementById('screen');
    screen.value = screen.value.slice(0, -1);
    updateExpression(screen.value);
}


// ================================
// calculate Function
// ================================
function calculate() {

    let screen = document.getElementById('screen');
    let expression = screen.value;

    // If empty do nothing
    if(expression === '') return;

    // If Error clear it
    if(expression === 'Error') {
        screen.value = '';
        updateExpression('');
        return;
    }

    try {
        // Save original expression for history
        let originalExpression = expression;

        // Fix percentage
        let fixedExpression = expression.replace(/(\d+)%/g, '($1/100)');

        // Calculate
        let answer = eval(fixedExpression);

        // Check valid number
        if(!isFinite(answer)) {
            screen.value = 'Error';
            updateExpression('Cannot divide by zero');
            return;
        }

        // Fix floating point
        answer = parseFloat(answer.toFixed(10));

        // Show expression above
        updateExpression(originalExpression + ' =');

        // Show answer
        screen.value = answer;

        // Animate answer
        screen.style.color = '#00b4d8';
        setTimeout(() => { screen.style.color = 'white'; }, 500);

        // Save to history
        saveHistory(originalExpression, answer);

    } catch(error) {
        screen.value = 'Error';
        updateExpression('Invalid expression');
    }
}


// ================================
// saveHistory Function
// ================================
function saveHistory(expression, answer) {

    historyArray.unshift({
        expression: expression,
        answer: answer
    });

    // Keep only 20
    if(historyArray.length > 20) {
        historyArray.pop();
    }

    updateHistoryDisplay();
}


// ================================
// updateHistoryDisplay Function
// ================================
function updateHistoryDisplay() {

    let historyList = document.getElementById('historyList');
    let historyCount = document.getElementById('historyCount');

    // Update count
    if(historyCount) {
        historyCount.textContent = 
        historyArray.length + ' calculation' + 
        (historyArray.length !== 1 ? 's' : '');
    }

    // Clear list
    historyList.innerHTML = '';

    // If empty show message
    if(historyArray.length === 0) {
        historyList.innerHTML = `
            <li class="empty-history">
                <i class="fas fa-clock"></i>
                <p>No calculations yet</p>
                <span>Your history will appear here</span>
            </li>
        `;
        return;
    }

    // Show each history item
    historyArray.forEach(function(item, index) {

        let li = document.createElement('li');

        li.innerHTML = `
            <div class="expression">${item.expression}</div>
            <div class="answer">= ${item.answer}</div>
        `;

        // Click to use answer again
        li.onclick = function() {
            let screen = document.getElementById('screen');
            screen.value = item.answer;
            updateExpression('From history');
        };

        historyList.appendChild(li);
    });
}


// ================================
// clearHistory Function
// ================================
function clearHistory() {
    historyArray = [];
    updateHistoryDisplay();
}


// ================================
// KEYBOARD SUPPORT
// ================================
document.addEventListener('keydown', function(event) {

    let key = event.key;

    if(key >= '0' && key <= '9')    { appendValue(key); }
    else if(key === '+')             { appendValue('+'); }
    else if(key === '-')             { appendValue('-'); }
    else if(key === '*')             { appendValue('*'); }
    else if(key === '/')             { event.preventDefault(); appendValue('/'); }
    else if(key === '.')             { appendValue('.'); }
    else if(key === '%')             { appendValue('%'); }
    else if(key === 'Enter' || key === '=') { calculate(); }
    else if(key === 'Backspace')     { deleteLast(); }
    else if(key === 'Escape')        { clearScreen(); }
});