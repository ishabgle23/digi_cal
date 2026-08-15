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

    // Get screen element
    let screen = document.getElementById('screen');

    // Get current screen value
    let currentValue = screen.value;

    // These are all operators
    let operators = ['+', '-', '*', '/','%'];

    // Check if last character is already an operator
    // This prevents double operators like ++ or +-
    let lastChar = currentValue.slice(-1);

    // If last character is operator and new value is also operator
    // Then replace last operator with new one
    if(operators.includes(lastChar) && operators.includes(value)) {
        screen.value = currentValue.slice(0, -1) + value;
        return;
    }

    // Prevent starting with operator except minus
    if(currentValue === '' && operators.includes(value) && value !== '-') {
        return;
    }

    // Prevent double decimal points
    // Split by operators and check last number
    if(value === '.') {
        // Get the last number segment
        let parts = currentValue.split(/[\+\-\*\/]/);
        let lastPart = parts[parts.length - 1];

        // If last number already has decimal point stop
        if(lastPart.includes('.')) {
            return;
        }
    }

    // Add value to screen
    screen.value += value;
}


// ================================
// clearScreen Function
// Clears everything on screen
// ================================
function clearScreen() {

    // Get screen element
    let screen = document.getElementById('screen');

    // Make it empty
    screen.value = '';
}


// ================================
// deleteLast Function
// Deletes last character from screen
// ================================
function deleteLast() {

    // Get screen element
    let screen = document.getElementById('screen');

    // Remove last character
    screen.value = screen.value.slice(0, -1);
}


// ================================
// calculate Function
// Main function that calculates answer
// ================================
function calculate() {

    // Get screen element
    let screen = document.getElementById('screen');

    // Save expression before calculating
    let expression = screen.value;

    // If screen is empty do nothing
    if(expression === '') {
        return;
    }

    // If screen shows Error clear it
    if(expression === 'Error') {
        screen.value = '';
        return;
    }

    try {

        // Replace % with /100 for correct calculation
        let fixedExpression = expression.replace(/(\d+)%/g, '($1/100)');

        // Calculate the answer using eval
        let answer = eval(fixedExpression);

        // Check if answer is valid number
        if(!isFinite(answer)) {
            screen.value = 'Error';
            return;
        }

        // Round answer to 10 decimal places
        // This fixes floating point issues like 0.1 + 0.2 = 0.30000000001
        answer = parseFloat(answer.toFixed(10));

        // Show answer on screen
        screen.value = answer;

        // Save to history
        saveHistory(expression, answer);

    } catch(error) {
        // If any error show Error message
        screen.value = 'Error';
    }
}


// ================================
// saveHistory Function
// Saves each calculation to history
// ================================
function saveHistory(expression, answer) {

    // Add new calculation at beginning of array
    historyArray.unshift({
        expression: expression,
        answer: answer
    });

    // Only keep last 20 calculations
    if(historyArray.length > 20) {
        historyArray.pop();
    }

    // Update the history display
    updateHistoryDisplay();
}


// ================================
// updateHistoryDisplay Function
// Shows history items on screen
// ================================
function updateHistoryDisplay() {

    // Get history list element
    let historyList = document.getElementById('historyList');

    // Clear current list
    historyList.innerHTML = '';

    // If no history show empty message
    if(historyArray.length === 0) {
        historyList.innerHTML =
        '<li class="empty-history">No calculations yet...</li>';
        return;
    }

    // Loop through each history item
    historyArray.forEach(function(item) {

        // Create new list item
        let li = document.createElement('li');

        // Add expression and answer
        li.innerHTML = `
            <div class="expression">${item.expression}</div>
            <div class="answer">= ${item.answer}</div>
        `;

        // When history item clicked
        // Put that answer back on screen
        li.onclick = function() {
            document.getElementById('screen').value = item.answer;
        };

        // Add item to list
        historyList.appendChild(li);
    });
}


// ================================
// clearHistory Function
// Clears all history items
// ================================
function clearHistory() {

    // Empty the array
    historyArray = [];

    // Update display
    updateHistoryDisplay();
}


// ================================
// KEYBOARD SUPPORT
// User can type numbers on keyboard
// ================================
document.addEventListener('keydown', function(event) {

    // Get the key pressed
    let key = event.key;

    // Number keys 0-9
    if(key >= '0' && key <= '9') {
        appendValue(key);
    }

    // Operator keys
    else if(key === '+') { appendValue('+'); }
    else if(key === '-') { appendValue('-'); }
    else if(key === '*') { appendValue('*'); }
    else if(key === '/') {
        // Prevent browser default action for /
        event.preventDefault();
        appendValue('/');
    }

    // Decimal point
    else if(key === '.') { appendValue('.'); }

    // Percent
    else if(key === '%') { appendValue('%'); }

    // Enter or = key calculates answer
    else if(key === 'Enter' || key === '=') { calculate(); }

    // Backspace deletes last character
    else if(key === 'Backspace') { deleteLast(); }

    // Escape key clears screen
    else if(key === 'Escape') { clearScreen(); }
});