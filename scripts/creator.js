const saveButton = document.getElementById('save-button');
const shareButton = document.getElementById('share-button');
const playButton = document.getElementById('play-button');
const codeDisplayDiv = document.getElementById('code-display');

saveButton.addEventListener('click', () => {
    // Retrieve values from the inputs
    const group1 = document.getElementById('group1').value;
    const item11 = document.getElementById('item1-1').value;
    const item12 = document.getElementById('item1-2').value;
    const item13 = document.getElementById('item1-3').value;
    const item14 = document.getElementById('item1-4').value;

    const group2 = document.getElementById('group2').value;
    const item21 = document.getElementById('item2-1').value;
    const item22 = document.getElementById('item2-2').value;
    const item23 = document.getElementById('item2-3').value;
    const item24 = document.getElementById('item2-4').value;

    const group3 = document.getElementById('group3').value;
    const item31 = document.getElementById('item3-1').value;
    const item32 = document.getElementById('item3-2').value;
    const item33 = document.getElementById('item3-3').value;
    const item34 = document.getElementById('item3-4').value;

    const group4 = document.getElementById('group4').value;
    const item41 = document.getElementById('item4-1').value;
    const item42 = document.getElementById('item4-2').value;
    const item43 = document.getElementById('item4-3').value;
    const item44 = document.getElementById('item4-4').value;

    const rows = [
        [group1, item11, item12, item13, item14],
        [group2, item21, item22, item23, item24],
        [group3, item31, item32, item33, item34],
        [group4, item41, item42, item43, item44]
    ]

    // Check for empty inputs
    const emptyInputs = rows.flat().filter(input => input.trim() === "");
    if (emptyInputs.length > 0) {
        alert("Please fill in all groups and items before saving your connections puzzle.");
        return;
    }

    // Check if all variables are unique
    const allValues = [
        group1, item11, item12, item13, item14,
        group2, item21, item22, item23, item24,
        group3, item31, item32, item33, item34,
        group4, item41, item42, item43, item44
    ];

    const uniqueValues = new Set(allValues);
    if (uniqueValues.size !== allValues.length) {
        alert("Please make sure all group and item names are unique with no duplicates present.");
        return;
    }

    let csvContent = ""
    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    // Create a blob and trigger a download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ConnectionsLabGame.csv';
    a.click();
    URL.revokeObjectURL(url);
});

playButton.addEventListener('click', function () {
    // Define all groups and items
    const fields = {
        group1: document.getElementById('group1').value,
        item1_1: document.getElementById('item1-1').value,
        item1_2: document.getElementById('item1-2').value,
        item1_3: document.getElementById('item1-3').value,
        item1_4: document.getElementById('item1-4').value,

        group2: document.getElementById('group2').value,
        item2_1: document.getElementById('item2-1').value,
        item2_2: document.getElementById('item2-2').value,
        item2_3: document.getElementById('item2-3').value,
        item2_4: document.getElementById('item2-4').value,

        group3: document.getElementById('group3').value,
        item3_1: document.getElementById('item3-1').value,
        item3_2: document.getElementById('item3-2').value,
        item3_3: document.getElementById('item3-3').value,
        item3_4: document.getElementById('item3-4').value,

        group4: document.getElementById('group4').value,
        item4_1: document.getElementById('item4-1').value,
        item4_2: document.getElementById('item4-2').value,
        item4_3: document.getElementById('item4-3').value,
        item4_4: document.getElementById('item4-4').value,
    };

    // Check if any field is empty
    for (const [key, value] of Object.entries(fields)) {
        if (!value.trim()) { // Check for empty or whitespace-only values
            alert("Please fill in all groups and items before playing your connections puzzle.");
            return; // Abort the save operation
        }
    }

    // Check if all variables are unique
    const allFields = Object.values(fields);
    const uniqueFields = new Set(allFields);
    if (uniqueFields.size !== allFields.length) {
        alert("All values must be unique. Please ensure no two values are the same.");
        return;
    }

    // Save fields to localStorage
    for (const [key, value] of Object.entries(fields)) {
        localStorage.setItem(key, value);
    }

    // alert('Fields saved to localStorage!');

    window.location.assign("./play.html");

});

shareButton.addEventListener('click', function () {
    // clear previous entries
    while (codeDisplayDiv.hasChildNodes()) {
        codeDisplayDiv.removeChild(codeDisplayDiv.firstChild);
    }

    generateUniqueCode().then(code => {

        // Define all groups and items
        const fields = {
            group1: document.getElementById('group1').value,
            item1_1: document.getElementById('item1-1').value,
            item1_2: document.getElementById('item1-2').value,
            item1_3: document.getElementById('item1-3').value,
            item1_4: document.getElementById('item1-4').value,

            group2: document.getElementById('group2').value,
            item2_1: document.getElementById('item2-1').value,
            item2_2: document.getElementById('item2-2').value,
            item2_3: document.getElementById('item2-3').value,
            item2_4: document.getElementById('item2-4').value,

            group3: document.getElementById('group3').value,
            item3_1: document.getElementById('item3-1').value,
            item3_2: document.getElementById('item3-2').value,
            item3_3: document.getElementById('item3-3').value,
            item3_4: document.getElementById('item3-4').value,

            group4: document.getElementById('group4').value,
            item4_1: document.getElementById('item4-1').value,
            item4_2: document.getElementById('item4-2').value,
            item4_3: document.getElementById('item4-3').value,
            item4_4: document.getElementById('item4-4').value,
        };

        // Check if any field is empty
        for (const [key, value] of Object.entries(fields)) {
            if (!value.trim()) { // Check for empty or whitespace-only values
                alert("Please fill in all groups and items before sharing your connections puzzle.");
                return; // Abort the save operation
            }
        }

        // Check if all variables are unique
        const allFields = Object.values(fields);
        const uniqueFields = new Set(allFields);
        if (uniqueFields.size !== allFields.length) {
            alert("All values must be unique. Please ensure no two values are the same.");
            return;
        }

        fetch(`/savegame/${code}/${fields['group1']}/${fields['item1_1']}/${fields['item1_2']}/${fields['item1_3']}/${fields['item1_4']}/${fields['group2']}/${fields['item2_1']}/${fields['item2_2']}/${fields['item2_3']}/${fields['item2_4']}/${fields['group3']}/${fields['item3_1']}/${fields['item3_2']}/${fields['item3_3']}/${fields['item3_4']}/${fields['group4']}/${fields['item4_1']}/${fields['item4_2']}/${fields['item4_3']}/${fields['item4_4']}`);

        console.log('Generated unique code:', code);

        const codeMessage = document.createElement('h4');
        codeMessage.textContent = 'SHARE YOUR GAME WITH THE CODE:'


        const codeDisplay = document.createElement('p');
        codeDisplay.textContent = code;

        codeDisplayDiv.appendChild(codeMessage);
        codeDisplayDiv.appendChild(codeDisplay);

    }).catch(error => {
        alert('Could not generate a unique code: ' + error.message);
    });
});

async function generateUniqueCode() {
    try {
        const response = await fetch('/getcodes/');
        const data = await response.json();
        const existingCodes = data[0];

        let newCode;
        let isUnique = false;

        const maxAttempts = 100;
        let attempts = 0;

        while (!isUnique && attempts < maxAttempts) {
            newCode = generateCode(); // I'm assuming this function exists elsewhere
            isUnique = true;

            for (let i = 0; i < existingCodes.length; i++) {
                if (newCode === existingCodes[i].code) {
                    isUnique = false;
                    break;
                }
            }

            attempts++;
        }

        if (!isUnique) {
            throw new Error('Could not generate a unique code after maximum attempts');
        }

        return newCode;

    } catch (error) {
        console.error('Error generating unique code:', error);
        throw error;
    }
}

// taken from https://stackoverflow.com/a/1349426
function generateCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 8) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}