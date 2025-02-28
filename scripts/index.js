// Constants for configuration
const CONFIG = {
    REQUIRED_ROWS: 4,
    REQUIRED_COLUMNS: 5,
    DEMO_GAMES_COUNT: 4,
    DEMO_GAMES_PATH: './demo-games/game',
    PLAY_PAGE_PATH: './play.html'
};

// Class to handle CSV loading and processing
class GameDataLoader {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const selectFileButton = document.getElementById('select-file-button');
        const loadButton = document.getElementById('load-button');
        const playDemoButton = document.getElementById('play-demo-button');
        const loadFromDBButton = document.getElementById('load-from-db');

        selectFileButton?.addEventListener('click', () => loadButton.click());
        loadButton?.addEventListener('change', (event) => this.handleFileSelection(event));
        playDemoButton?.addEventListener('click', () => this.loadRandomDemoGame());
        loadFromDBButton?.addEventListener('click', (event) => this.loadGameFromCode(event));
    }

    validateCSVFormat(rows) {
        return rows.length === CONFIG.REQUIRED_ROWS && 
               rows.every(row => row.length === CONFIG.REQUIRED_COLUMNS);
    }

    parseCSVToFields(rows) {
        const fields = {};
        
        for (let i = 0; i < CONFIG.REQUIRED_ROWS; i++) {
            fields[`group${i + 1}`] = rows[i][0];
            for (let j = 1; j < CONFIG.REQUIRED_COLUMNS; j++) {
                fields[`item${i + 1}_${j}`] = rows[i][j];
            }
        }
        
        return fields;
    }

    parseSQLToFields(data) {
        const fields = {};
        for (let i = 0; i < CONFIG.REQUIRED_ROWS; i++) {
            fields[`group${i + 1}`] = data[0][0][`g${i + 1}0`];
            for (let j = 1; j < CONFIG.REQUIRED_COLUMNS; j++) {
                fields[`item${i + 1}_${j}`] = data[0][0][`g${i + 1}${j}`];
            }
        }
        
        console.table(fields);
        return fields;
    }

    saveToLocalStorage(fields) {
        localStorage.clear();
        
        Object.entries(fields).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });
    }

    redirectToPlayPage() {
        window.location.assign(CONFIG.PLAY_PAGE_PATH);
    }

    processCSVData(csvData) {
        const rows = csvData.trim().split(/\r?\n/).map(row => row.split(","));

        if (!this.validateCSVFormat(rows)) {
            throw new Error(`Invalid CSV format! Ensure there are ${CONFIG.REQUIRED_ROWS} rows and ${CONFIG.REQUIRED_COLUMNS} columns per row.`);
        }

        const fields = this.parseCSVToFields(rows);
        this.saveToLocalStorage(fields);
        this.redirectToPlayPage();
    }

    async handleFileSelection(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const csvData = await this.readFile(file);
            this.processCSVData(csvData);
        } catch (error) {
            alert(error.message);
            console.error('Error processing file:', error);
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }

    async loadRandomDemoGame() {
        const randomNumber = Math.floor(Math.random() * CONFIG.DEMO_GAMES_COUNT) + 1;
        const filePath = `${CONFIG.DEMO_GAMES_PATH}${randomNumber}.csv`;

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('Demo file not found');
            
            const csvData = await response.text();
            this.processCSVData(csvData);
        } catch (error) {
            console.error('Error loading the CSV file:', error);
            alert('Failed to load demo game');
        }
    }

    async loadGameFromCode(event) {
        event.preventDefault();

        let code = document.getElementById("game-code").value.toUpperCase();;

        this.queryBackend(code);
    }

    queryBackend(code) {
        fetch(`/getgame/${code}`)
        .then(response => response.json())
        .then(data => {
            const fields = this.parseSQLToFields(data);
            this.saveToLocalStorage(fields);
            this.redirectToPlayPage();
        })
        .catch(error => alert(`${code} is not a valid game code.`));
    }
}

// Initialize the loader when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameDataLoader();
});