function createCalculator(gridHeight, gridWidth, buttonLabels) {
    let tempLabels = buttonLabels;
    let squareHeight = (1 / gridHeight) * 100;
    let squareWidth = (1 / gridWidth) * 100;

    // rows
    for (let i = 0; i < gridHeight; i++) {
        // row for each gridHeight
        const gridRow = document.createElement('div');
        gridRow.setAttribute('class', 'grid-row');
        gridRow.style.height = `${squareHeight}%`;
        gridContainer.appendChild(gridRow);

        // columns
        for (let j = 0; j < gridWidth; j++) {
            let label = tempLabels.shift();
            let labelText = getLabelText(label);

            // square for each gridWidth inside of each row
            const gridSquare = document.createElement('div');
            gridSquare.setAttribute('class', 'grid-square');
            gridSquare.style.width = `${squareWidth}%`;
            gridRow.appendChild(gridSquare);

            // button in each square
            const calcButton = document.createElement('button');
            calcButton.setAttribute('class', `calc-button button-${labelText}`);
            calcButton.style.height = `80%`;
            calcButton.style.maxHeight = `100px`;
            calcButton.style.width = `80%`;
            calcButton.style.maxWidth = `100px`;
            calcButton.innerHTML = label;
            calcButton.addEventListener('click', (e) => {
                appendString(label);
            });
            gridSquare.appendChild(calcButton);
        }
    }
    createUniqueButtons();
}

function getLabelText(label) {
    switch (label) {
        case '=':
            return 'equals';
        case '+':
            return 'add';
        case '-':
            return 'subtract';
        case '*':
            return 'multiply';
        case '/':
            return 'divide';
        case '.':
            return 'period';
        case '(':
            return 'bracket-left';
        case ')':
            return 'bracket-right';
        default:
            return label;
    }
}

function appendString(label) {
    const isUnique = /(?:=|C|CE)/.test(label);

    if (!isUnique) {
        if (
            equationString === 'Invalid' ||
            equationString === 'Infinity' ||
            equationString === 'NaN'
        ) {
            equationString = '';
        }
        equationString = equationString.concat(label);
    }

    text = document.createTextNode(equationString);
    outputTextbox.innerHTML = '';
    outputTextbox.appendChild(text);
}

function createUniqueButtons() {
    // equals button initiates calculation
    equalsButton = document.getElementsByClassName('button-equals');
    equalsButton[0].style.fontWeight = '700';
    equalsButton[0].addEventListener('click', (e) => solveEquation());

    // clear button removes last typed value
    clearButton = document.getElementsByClassName('button-C');
    clearButton[0].style.fontWeight = '700';
    clearButton[0].addEventListener('click', (e) => clearLast());

    // clear everything button sets the equation back to blank
    clearEverythingButton = document.getElementsByClassName('button-CE');
    clearEverythingButton[0].style.fontWeight = '700';
    clearEverythingButton[0].addEventListener('click', (e) =>
        clearEverything()
    );
}

function solveEquation() {
    if (validateEquation()) {
        const result = evaluateEquation(equationString);
        updateOutput(result);
    } else {
        updateOutput('Invalid');
    }
}

function validateEquation() {
    // invalid characters
    const invalidCharsRegex = /[^0-9+\-*/.()]/;
    if (invalidCharsRegex.test(equationString)) {
        return false;
    }

    // invalid operator placements
    const invalidOperatorPlacementRegex =
        /(\d\s*\()|(\)\s*\d)|([+\-*/.]\s*[+\-*/.])/;
    if (invalidOperatorPlacementRegex.test(equationString)) {
        return false;
    }

    // balanced parentheses
    if (!areParenthesesBalanced(equationString)) {
        return false;
    }

    // equation doesn't start or end with an operator
    const startsWithOperatorRegex = /^[+\-*/.]/;
    const endsWithOperatorRegex = /[+\-*/.]$/;
    if (
        startsWithOperatorRegex.test(equationString) ||
        endsWithOperatorRegex.test(equationString)
    ) {
        return false;
    }

    return true;
}

function areParenthesesBalanced(equation) {
    const stack = [];
    const parentheses = { '(': ')' };

    for (const char of equation) {
        if (char in parentheses) {
            stack.push(char);
        } else if (Object.values(parentheses).includes(char)) {
            if (parentheses[stack.pop()] !== char) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

function evaluateEquation(equation) {
    const operators = { '+': 1, '-': 1, '*': 2, '/': 2 };

    // get the precedence of an operator
    function precedence(operator) {
        return operators[operator] || 0;
    }

    // check if a token is an operator
    function isOperator(token) {
        return token in operators;
    }

    // apply an operator to operands
    function applyOperator(operator, operands) {
        const b = operands.pop();
        const a = operands.pop();

        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return a / b;
            default:
                return;
        }
    }

    // convert the equation into postfix notation
    function convertToPostfix(tokens) {
        const output = [];
        const operatorStack = [];

        for (const token of tokens) {
            if (!isNaN(token)) {
                output.push(parseFloat(token));
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                // if ')', pop operators from the stack to the output until '(' is encountered
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1] !== '('
                ) {
                    output.push(operatorStack.pop());
                }
                operatorStack.pop(); // Remove '(' from the stack
            } else if (isOperator(token)) {
                // if an operator, pop operators from the stack to the output based on precedence
                while (
                    operatorStack.length > 0 &&
                    precedence(operatorStack[operatorStack.length - 1]) >=
                        precedence(token)
                ) {
                    output.push(operatorStack.pop());
                }
                operatorStack.push(token);
            }
        }

        // pop any remaining operators from the stack to the output
        while (operatorStack.length > 0) {
            output.push(operatorStack.pop());
        }

        return output;
    }

    // calculate the result of the postfix equation
    function calculateResult(postfixTokens) {
        const stack = [];

        for (const token of postfixTokens) {
            if (!isNaN(token)) {
                stack.push(parseFloat(token));
            } else if (isOperator(token)) {
                if (stack.length < 2) {
                    return 'Invalid';
                }

                const b = stack.pop();
                const a = stack.pop();

                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                    default:
                        return 'Invalid';
                }
            }
        }

        if (stack.length !== 1) {
            return 'Invalid';
        }

        return stack.pop();
    }

    const tokens =
        equation.match(/([0-9]+(?:\.[0-9]+)?|[\+\-\*\/\(\)])/g) || [];
    const postfixTokens = convertToPostfix(tokens);
    const result = calculateResult(postfixTokens);

    return result;
}

function updateOutput(result) {
    if (result !== null && result !== undefined) {
        // updates output when valid result found
        equationString = result.toString();
        text = document.createTextNode(equationString);
        outputTextbox.innerHTML = '';
        outputTextbox.appendChild(text);
    } else {
        equationString = '';
    }
}

function clearLast() {
    if (
        equationString === 'Invalid' ||
        equationString === 'Infinity' ||
        equationString === 'NaN'
    ) {
        // to treat keywords as a single value in the output screen
        clearEverything();
        return;
    }
    equationString = equationString.substring(0, equationString.length - 1);
    text = document.createTextNode(equationString);
    outputTextbox.innerHTML = '';
    outputTextbox.appendChild(text);
}

function clearEverything() {
    equationString = '';
    text = document.createTextNode(equationString);
    outputTextbox.innerHTML = '';
    outputTextbox.appendChild(text);
}

let equationString = '';
const gridHeight = 5;
const gridWidth = 4;
const buttonLabels = [
    '(', // row 1
    ')',
    'C',
    'CE',
    '7', // row 2
    '8',
    '9',
    '/',
    '4', // row 3
    '5',
    '6',
    '*',
    '1', // row 4
    '2',
    '3',
    '-',
    '=', // row 5
    '0',
    '.',
    '+',
];

// outermost container, divided into output and grid
const calculatorContainer = document.createElement('div');
calculatorContainer.setAttribute('class', 'calculator-container');
document.body.appendChild(calculatorContainer);

// output container
const outputContainer = document.createElement('div');
outputContainer.setAttribute('class', 'output-container');
calculatorContainer.appendChild(outputContainer);

// inner text area for output
const outputTextbox = document.createElement('div');
outputTextbox.setAttribute('class', 'output-textbox');
outputContainer.appendChild(outputTextbox);

// grid container
const gridContainer = document.createElement('div');
gridContainer.setAttribute('class', 'grid-container');
calculatorContainer.appendChild(gridContainer);
createCalculator(gridHeight, gridWidth, buttonLabels);
