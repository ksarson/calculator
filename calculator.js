function createCalculator(gridHeight, gridWidth, buttonLabels)
{
    let tempLabels = buttonLabels;
    let squareHeight = (1/gridHeight)*100;
    let squareWidth = (1/gridWidth)*100;
    for(let i=0; i<gridHeight; i++)
    {
        const gridRow = document.createElement('div');
        gridRow.setAttribute('class', 'grid-row');
        gridRow.style.height = `${squareHeight}%`
        gridContainer.appendChild(gridRow);

        for(let j=0; j<gridWidth; j++)
        {
            let label = tempLabels.shift();
            let labelText = getLabelText(label);

            const gridSquare = document.createElement('div');
            gridSquare.setAttribute('class', 'grid-square');
            gridSquare.style.width = `${squareWidth}%`
            gridRow.appendChild(gridSquare);

            const calcButton = document.createElement('button');
            calcButton.setAttribute('class', `calc-button button-${labelText}`);
            calcButton.innerHTML = label;
            calcButton.addEventListener('click', e => {appendString(label)});
            gridSquare.appendChild(calcButton);
        }
    }
    createUniqueButtons();
}

function getLabelText(label)
{
    switch(label)
    {
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

function appendString(label) 
{
    const isUnique = /(?:=|C|CE)/.test(label)

    if (!isUnique)
    {
        if (equationString === 'Invalid' || equationString === 'Infinity' || equationString === 'NaN')
        {
            equationString = '';
        }
        equationString = equationString.concat(label);
    }
    text = document.createTextNode(equationString);
    outputContainer.innerHTML = '';
    outputContainer.appendChild(text);
}

function createUniqueButtons()
{
    equalsButton = document.getElementsByClassName('button-equals');
    equalsButton[0].style.color = 'red';
    equalsButton[0].addEventListener('click', e => solveEquation());

    clearButton = document.getElementsByClassName('button-C');
    clearButton[0].style.color = 'red';
    clearButton[0].addEventListener('click', e => clearLast());

    clearEverythingButton = document.getElementsByClassName('button-CE');
    clearEverythingButton[0].style.color = 'red';
    clearEverythingButton[0].addEventListener('click', e => clearEverything());
}

function solveEquation()
{
    if(validateEquation())
    {
        console.log('solving');
    }
    else
    {
        console.log('not solving');
    }
}

function validateEquation() {
    // Check for invalid characters
    const invalidCharsRegex = /[^0-9+\-*/.()]/;
    if (invalidCharsRegex.test(equationString)) {
        console.log('Invalid characters in the equation');
        return false;
    }

    // Check for invalid operator placements
    const invalidOperatorPlacementRegex = /(\d\s*\()|(\)\s*\d)|([+\-*/.]\s*[+\-*/.])/;
    if (invalidOperatorPlacementRegex.test(equationString)) {
        console.log('Invalid operator placement');
        return false;
    }

    // Check for unbalanced parentheses
    if (!areParenthesesBalanced(equationString)) {
        console.log('Unbalanced parentheses');
        return false;
    }

    // Check that the equation doesn't start or end with an operator
    const startsWithOperatorRegex = /^[+\-*/.]/;
    const endsWithOperatorRegex = /[+\-*/.]$/;
    if (startsWithOperatorRegex.test(equationString) || endsWithOperatorRegex.test(equationString)) {
        console.log('Equation cannot start or end with an operator');
        return false;
    }

    return true;
}

function areParenthesesBalanced(equation) 
{
    const stack = [];
    const parentheses = { '(': ')' };

    for (const char of equation) 
    {
        if (char in parentheses) 
        {
            stack.push(char);
        } 
        else if (Object.values(parentheses).includes(char)) 
        {
            if (parentheses[stack.pop()] !== char) 
            {
                return false;
            }
        }
    }

    return stack.length === 0;
}

function updateOutput(result) 
{
    if (result !== null && result !== undefined) 
    {
        equationString = result.toString(); // Update equationString with the result
        text = document.createTextNode(equationString);
        outputContainer.innerHTML = '';
        outputContainer.appendChild(text);
    } 
    else 
    {
        equationString = '';
        console.log('Invalid result. Unable to update output.');
    }
}

function clearLast()
{
    if (equationString === 'Invalid' || equationString === 'Infinity' || equationString === 'NaN')
    {
        clearEverything();
        return;
    }
    equationString = equationString.substring(0, equationString.length-1);
    text = document.createTextNode(equationString);
    outputContainer.innerHTML = '';
    outputContainer.appendChild(text);
}

function clearEverything()
{
    equationString = '';
    text = document.createTextNode(equationString);
    outputContainer.innerHTML = '';
    outputContainer.appendChild(text);
}

const outputContainer = document.createElement('div');
outputContainer.setAttribute('class', 'output-container');
document.body.appendChild(outputContainer);

let equationString = '';
const gridHeight = 5;
const gridWidth = 4;
const buttonLabels = [  '(', ')', 'C', 'CE',
                        '7', '8', '9', '/', 
                        '4', '5', '6', '*',
                        '1', '2', '3', '-',
                        '=', '0', '.', '+'];

const gridContainer = document.createElement('div');
gridContainer.setAttribute('class', 'grid-container');
document.body.appendChild(gridContainer);
createCalculator(gridHeight, gridWidth, buttonLabels);
