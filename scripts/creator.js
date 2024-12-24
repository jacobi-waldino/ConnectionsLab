// Attach an event listener to the Save button
const saveButton = document.getElementById('save-button');

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
    a.download = 'CustomConnections.csv';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('play-button').addEventListener('click', function () {
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

