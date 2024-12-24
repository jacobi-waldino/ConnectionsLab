// Attach an event listener to the Select CSV File button
const selectFileButton = document.getElementById('select-file-button');
const loadButton = document.getElementById('load-button');

selectFileButton.addEventListener('click', () => {
    loadButton.click(); // Trigger the file input click event
});

// Attach an event listener to the Load button (file input)
loadButton.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvData = e.target.result;

            // // Debug: log the raw CSV data to check its structure
            // console.log("Raw CSV Data:", csvData);

            // Split by lines and clean up empty lines (which might be caused by extra newlines at the end)
            const rows = csvData.trim().split(/\r?\n/).map(row => row.split(","));

            // // Debug: log the rows to see the structure
            // console.log("Parsed Rows:", rows);

            // Ensure the CSV format has exactly 4 rows and 5 columns per row
            if (rows.length === 4 && rows.every(row => row.length === 5)) {
                // Create an object with the fields to store in localStorage
                const fields = {
                    group1: rows[0][0],
                    item1_1: rows[0][1],
                    item1_2: rows[0][2],
                    item1_3: rows[0][3],
                    item1_4: rows[0][4],
                    
                    group2: rows[1][0],
                    item2_1: rows[1][1],
                    item2_2: rows[1][2],
                    item2_3: rows[1][3],
                    item2_4: rows[1][4],
                    
                    group3: rows[2][0],
                    item3_1: rows[2][1],
                    item3_2: rows[2][2],
                    item3_3: rows[2][3],
                    item3_4: rows[2][4],
                    
                    group4: rows[3][0],
                    item4_1: rows[3][1],
                    item4_2: rows[3][2],
                    item4_3: rows[3][3],
                    item4_4: rows[3][4]
                };

                // Save the fields to localStorage
                for (const [key, value] of Object.entries(fields)) {
                    localStorage.setItem(key, value);
                }

                // Optionally redirect to play page
                window.location.assign("./play.html");
            } else {
                alert('Invalid CSV format! Ensure there are 4 rows and 5 columns per row.');
            }
        };
        
        reader.readAsText(file);
    }
});
