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
    screen.value += value;
}


// ================================
// clearScreen Function
// Clears everything on screen
// ================================
function clearScreen() {
    let screen = document.getElementById('screen');
    screen.value = '';
}


// ================================
// deleteLast Function
// Deletes last character
// ================================
function deleteLast() {
    let screen = document.getElementById('screen');
    screen.value = screen.value.slice(0, -1);
}


// ================================
// calculate Function
// Calculates the answer
// ================================
function calculate() {
    let screen = document.getElementById('screen');

    // Save expression before calculating
    let expression = screen.value;

    try {
        // Calculate answer
        let answer = eval(expression);

        // Show answer on screen
        screen.value = answer;

        // Save to history
        saveHistory(expression, answer);

    } catch (error) {
        screen.value = 'Error';
    }
}


// ================================
// saveHistory Function
// Saves calculation to history list
// ================================
function saveHistory(expression, answer) {

    // Add to history array
    historyArray.unshift({ expression, answer });

    // Update history display
    updateHistoryDisplay();
}


// ================================
// updateHistoryDisplay Function
// Shows history on screen
// ================================
function updateHistoryDisplay() {

    // Get history list element
    let historyList = document.getElementById('historyList');

    // Clear current list
    historyList.innerHTML = '';

    // If no history show empty message
    if (historyArray.length === 0) {
        historyList.innerHTML = 
        '<li class="empty-history">No calculations yet...</li>';
        return;
    }

    // Loop through history and show each item
    historyArray.forEach(function(item) {

        // Create list item
        let li = document.createElement('li');

        // Add expression and answer inside li
        li.innerHTML = `
            <div class="expression">${item.expression}</div>
            <div class="answer">= ${item.answer}</div>
        `;

        // When clicked - put answer back on screen
        li.onclick = function() {
            document.getElementById('screen').value = item.answer;
        };

        // Add to list
        historyList.appendChild(li);
    });
}


// ================================
// clearHistory Function
// Clears all history
// ================================
function clearHistory() {
    // Empty the array
    historyArray = [];

    // Update display
    updateHistoryDisplay();
}