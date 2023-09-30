function createCalculator(gridSize, buttonLabels)
{
    let tempLabels = buttonLabels;
    let squareSize = (1/gridSize)*100;
    for(let i=0; i<gridSize; i++)
    {
        const gridRow = document.createElement('div');
        gridRow.setAttribute('class', 'grid-row');
        gridRow.style.height = `${squareSize}%`
        gridContainer.appendChild(gridRow);

        for(let j=0; j<gridSize; j++)
        {
            let label = tempLabels.shift();
            let labelText = getLabelText(label);

            const gridSquare = document.createElement('div');
            gridSquare.setAttribute('class', 'grid-square');
            gridSquare.style.width = `${squareSize}%`
            gridRow.appendChild(gridSquare);

            const calcButton = document.createElement('button');
            calcButton.setAttribute('class', `calc-button button-${labelText}`);
            calcButton.innerHTML = label;
            calcButton.addEventListener('click', e => {appendString(label)});
            gridSquare.appendChild(calcButton);
        }
    }
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
        default:
            return label;
    }
}

function appendString(label) 
{
    if (label !== '=' && label !== 'C' && label !== 'CE')
    {
        equationString = equationString.concat(label);
    }
    text = document.createTextNode(equationString);
    outputContainer.innerHTML = '';
    outputContainer.appendChild(text);
}

const outputContainer = document.createElement('div');
outputContainer.setAttribute('class', 'output-container');
document.body.appendChild(outputContainer);

let equationString = '';
let gridSize = 4;
const buttonLabels = [
                        'CE', 'C', '=', '/', 
                        '1', '2', '3', '*', 
                        '4', '5', '6', '-',
                        '7', '8', '9', '+'
                    ];

const gridContainer = document.createElement('div');
gridContainer.setAttribute('class', 'grid-container');
document.body.appendChild(gridContainer);
createCalculator(gridSize, buttonLabels);
