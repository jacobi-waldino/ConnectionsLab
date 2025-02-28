function toggleButtonStyle(event) {
    const buttonId = event.target.id;
    const buttonState = event.target.classList.toggle('active');

    buttonStates[buttonId] = buttonState;
}

function deselectAllButtons() {
    document.querySelectorAll('.item-button').forEach(button => {
        button.classList.remove('active');
        buttonStates[button.id] = false;
    });
}

document.getElementById('deselect-button').addEventListener('click', deselectAllButtons);
document.getElementById('shuffle-button').addEventListener('click', shuffleButtons);


const buttonStates = {};

let randomizedOrder = [];

var group1Name = "";
var group2Name = "";
var group3Name = "";
var group4Name = "";

// Group item constants (empty lists initially)
const group1Items = [];
const group2Items = [];
const group3Items = [];
const group4Items = [];

var group1Completed = false;
var group2Completed = false;
var group3Completed = false;
var group4Completed = false;

var mistakesRemaining = 4;

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'randomizedOrder';
    const itemKeys = [
        'item1_1', 'item1_2', 'item1_3', 'item1_4',
        'item2_1', 'item2_2', 'item2_3', 'item2_4',
        'item3_1', 'item3_2', 'item3_3', 'item3_4',
        'item4_1', 'item4_2', 'item4_3', 'item4_4'
    ];

    const items = itemKeys.map(key => localStorage.getItem(key));

    // remove null or undefined values if any items are missing
    const validItems = items.filter(item => item);

    // check if a randomized order exists in localStorage
    const storedRandomizedOrder = localStorage.getItem(storageKey);

    // if no randomized order is found or if data has changed, randomize and update the storage
    const currentDataHash = validItems.join('|');
    const storedDataHash = storedRandomizedOrder ? JSON.parse(storedRandomizedOrder).join('|') : '';

    if (!storedRandomizedOrder || currentDataHash !== storedDataHash) {
        randomizedOrder = [...validItems];
        for (let i = randomizedOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomizedOrder[i], randomizedOrder[j]] = [randomizedOrder[j], randomizedOrder[i]];
        }

        // save the new randomized order to localStorage
        localStorage.setItem(storageKey, JSON.stringify(randomizedOrder));
    } else {
        randomizedOrder = JSON.parse(storedRandomizedOrder);  // Use stored order if valid
    }

    // assign items to buttons based on the randomized order
    randomizedOrder.forEach((item, index) => {
        const button = document.getElementById((index + 1).toString());
        if (button) {
            button.textContent = item;
        }
    });
    
    // distribute items into respective groups
    group1Items.push(...items.slice(0, 4));  // First 4 items for Group 1
    group2Items.push(...items.slice(4, 8));  // Next 4 items for Group 2
    group3Items.push(...items.slice(8, 12)); // Next 4 items for Group 3
    group4Items.push(...items.slice(12, 16)); // Last 4 items for Group 4

    group1Items.sort();
    group2Items.sort();
    group3Items.sort();
    group4Items.sort();
    
    group1Name = localStorage.getItem('group1');
    group2Name = localStorage.getItem('group2');
    group3Name = localStorage.getItem('group3');
    group4Name = localStorage.getItem('group4');

    // log the items in each group as reference
    // console.log('Group 1 Items:', group1Items);
    // console.log('Group 2 Items:', group2Items);
    // console.log('Group 3 Items:', group3Items);
    // console.log('Group 4 Items:', group4Items);

    // initialize the button states with all buttons initially not toggled
    document.querySelectorAll('.item-button').forEach(button => {
        buttonStates[button.id] = false;  // Set the initial state as false (untoggled)
    });
});

// set up the event listener for buttons after the DOM is loaded
document.querySelectorAll('.item-button').forEach(button => {
    button.addEventListener('click', toggleButtonStyle);
});

// submit button functionality
document.getElementById('submit-button').addEventListener('click', () => {
    if(mistakesRemaining <= 0) {
        return;
    }
    
    // clear the selectedItems array before repopulating it
    let selectedItems = [];
    let oneAway = false;

    // console.log(selectedItems);
    
    // pushes all currently selected items into a list
    document.querySelectorAll('.item-button').forEach(button => {
        if (button.classList.contains('active')) {
            const buttonText = button.textContent.trim();
            selectedItems.push(buttonText);
        }
    });

    // console.log(selectedItems);
    selectedItems.sort();

    document.getElementById('play-explanation').textContent = 'create four groups of four';

    if (selectedItems.length == 4 && mistakesRemaining > 0) {
        if (selectedItems.every((value, index) => value === group1Items[index]) && group1Completed == false) {
            group1Completed = true;

            const groupName = document.getElementById('group-1');
            groupName.textContent = group1Name;
            groupName.style.color = '#f9df6d';

            selectedItems.forEach(item => {
                const matchingButtons = Array.from(document.querySelectorAll('.item-button')).filter(button => button.textContent.trim() === item);
                matchingButtons.forEach(button => {
                    if (button) {
                        button.classList.remove('active');
                        button.style.backgroundColor = '#f9df6d';
                        button.style.color = 'white';
                        button.disabled = true;
                        
                    }
                });
            });


        } else if (selectedItems.every((value, index) => value === group2Items[index]) && group2Completed == false) {
            group2Completed = true;

            const groupName = document.getElementById('group-2');
            groupName.textContent = group2Name;
            groupName.style.color = '#a0c35a';

            selectedItems.forEach(item => {
                const matchingButtons = Array.from(document.querySelectorAll('.item-button')).filter(button => button.textContent.trim() === item);
                matchingButtons.forEach(button => {
                    if (button) {
                        button.classList.remove('active');
                        button.style.backgroundColor = '#a0c35a';
                        button.style.color = 'white'; 
                        button.disabled = true;
                        
                    }
                });
            });

        } else if (selectedItems.every((value, index) => value === group3Items[index]) && group3Completed == false) {
            group3Completed = true;
            
            const groupName = document.getElementById('group-3');
            groupName.textContent = group3Name;
            groupName.style.color = '#b0c4ef';

            selectedItems.forEach(item => {
                const matchingButtons = Array.from(document.querySelectorAll('.item-button')).filter(button => button.textContent.trim() === item);
                matchingButtons.forEach(button => {
                    if (button) {
                        button.classList.remove('active');
                        button.style.backgroundColor = '#b0c4ef';
                        button.style.color = 'white';
                        button.disabled = true;
                    }
                });
            });

        } else if (selectedItems.every((value, index) => value === group4Items[index]) && group4Completed == false) {
            group4Completed = true;

            const groupName = document.getElementById('group-4');
            groupName.textContent = group4Name;
            groupName.style.color = '#ba81c5';

            selectedItems.forEach(item => {
                const matchingButtons = Array.from(document.querySelectorAll('.item-button')).filter(button => button.textContent.trim() === item);
                matchingButtons.forEach(button => {
                    if (button) {
                        button.classList.remove('active');
                        button.style.backgroundColor = '#ba81c5';
                        button.style.color = 'white';
                        button.disabled = true;
                    }
                });
            });

        }
        else
        {
            let matchCount1 = 0;
            let matchCount2 = 0;
            let matchCount3 = 0;
            let matchCount4 = 0;

            selectedItems.forEach((value, index) => {
                if (value === group1Items[index]) {
                    matchCount1++;
                }
            });

            selectedItems.forEach((value, index) => {
                if (value === group2Items[index]) {
                    matchCount2++;
                }
            });
            
            selectedItems.forEach((value, index) => {
                if (value === group3Items[index]) {
                    matchCount3++;
                }
            });
            
            selectedItems.forEach((value, index) => {
                if (value === group4Items[index]) {
                    matchCount4++;
                }
            });
            

            document.getElementById('misses').textContent = document.getElementById('misses').textContent.slice(0, -2);
            mistakesRemaining--;
            
            // console.log(matchCount1);
            // console.log(matchCount2);
            // console.log(matchCount3);
            // console.log(matchCount4);

            if(mistakesRemaining == 0) {
                document.getElementById('play-explanation').textContent = 'better luck next time';
                loseSequence()
            }
            else {
                if(matchCount1 == 3 || matchCount2 == 3 || matchCount3 == 3 || matchCount4 == 3) {
                    document.getElementById('play-explanation').textContent = 'one away...';
                }
                else {
                    document.getElementById('play-explanation').textContent = 'try again';
                }
                
            }
        }
        if(group1Completed && group2Completed && group3Completed && group4Completed) {
            document.getElementById('play-explanation').textContent = 'You solved the connections!';
        }

    }
    else
    {
        document.getElementById('play-explanation').textContent = 'you can only select exactly four items';
    }
});

function loseSequence() {
    deselectAllButtons();  // deselect all buttons first

    // helper function to solve a group
    function solveGroup(groupItems, groupName, groupColor, groupId) {
        // highlight and "select" the items of the group one by one
        groupItems.forEach((item, index) => {
            const matchingButtons = Array.from(document.querySelectorAll('.item-button')).filter(button => button.textContent.trim() === item);
            matchingButtons.forEach(button => {
                if (button) {
                    // visually highlight the button (simulate the user selecting it)
                    button.classList.add('active');
                    button.style.backgroundColor = groupColor; // set background color of the group
                    button.style.color = 'white'; // set text color
                    button.disabled = true; // make button unselectable (like it's been solved)

                    // simulate solving the group with a slight delay to visualize it
                    setTimeout(() => {
                        const groupNameElement = document.getElementById(groupId);
                        groupNameElement.textContent = groupName;
                        groupNameElement.style.color = groupColor;
                    }, 500 * index);  // adjust delay to make it visually smooth
                }
            });
        });
    }

    let timeout = 0;
    let timeoutAddend = 1500;

    // dolve remaining groups one by one with a delay
    if(!group1Completed)
        {
            timeout += timeoutAddend;
            setTimeout(() => {
                solveGroup(group1Items, group1Name, '#f9df6d', 'group-1');
            }, timeout); // start solving group 1 after 1 second
        }
    
    if (!group2Completed) 
        {
            timeout += timeoutAddend;
            setTimeout(() => {
                    solveGroup(group2Items, group2Name, '#a0c35a', 'group-2');
            }, timeout); // start solving group 2 after 2 seconds
        }
    
    if (!group3Completed) 
        {
            timeout += timeoutAddend;
            setTimeout(() => {
                solveGroup(group3Items, group3Name, '#b0c4ef', 'group-3');
            }, timeout); // start solving group 3 after 3 seconds
        }
    
    if (!group4Completed) 
        {
            timeout += timeoutAddend;
            setTimeout(() => {
                solveGroup(group4Items, group4Name, '#ba81c5', 'group-4');
            }, timeout); // start solving group 4 after 4 seconds
        }   
}

function shuffleButtons() {
    // get all buttons
    const buttons = Array.from(document.querySelectorAll('.item-button'));
    
    // get all solved items (items in completed groups)
    const solvedItems = [
        ...(group1Completed ? group1Items : []),
        ...(group2Completed ? group2Items : []),
        ...(group3Completed ? group3Items : []),
        ...(group4Completed ? group4Items : [])
    ];

    // create a copy of the current button data
    const buttonData = buttons.map(button => ({
        id: button.id,
        text: button.textContent,
        isActive: button.classList.contains('active'),
        isSolved: solvedItems.includes(button.textContent.trim()),
        // store the solved state colors if this is a solved button
        backgroundColor: solvedItems.includes(button.textContent.trim()) ? button.style.backgroundColor : '',
        color: solvedItems.includes(button.textContent.trim()) ? button.style.color : ''
    }));

    // separate solved and unsolved buttons
    const solvedButtons = buttonData.filter(data => data.isSolved);
    const unsolvedButtons = buttonData.filter(data => !data.isSolved);
    
    // only shuffle the unsolved buttons
    for (let i = unsolvedButtons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unsolvedButtons[i], unsolvedButtons[j]] = [unsolvedButtons[j], unsolvedButtons[i]];
    }

    // combine back solved and shuffled unsolved buttons
    const shuffledData = [...solvedButtons, ...unsolvedButtons];
    
    // update the randomizedOrder array
    randomizedOrder = shuffledData.map(data => data.text);
    
    // apply the shuffled data back to the buttons
    buttons.forEach((button, index) => {
        const data = shuffledData[index];
        
        button.textContent = data.text;
        
        button.classList.remove('active');
        button.style.backgroundColor = '';
        button.style.color = '';
        button.disabled = false;
        
        if (data.isSolved) {
            button.style.backgroundColor = data.backgroundColor;
            button.style.color = data.color;
            button.disabled = true;
        } else {
            // if it's not solved but was active, maintain active state
            if (data.isActive) {
                button.classList.add('active');
            }
        }
    });
    
    // update localStorage with new randomized order
    localStorage.setItem('randomizedOrder', JSON.stringify(randomizedOrder));
}
