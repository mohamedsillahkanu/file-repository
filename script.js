// Global variables
var isAdminLoggedIn = false;
var currentUser = null;
var currentMonth = null;
var currentWeek = null;
var currentToast = null;

// Configuration for multiple backup methods
const BACKUP_CONFIG = {
    // Python Backend (Primary) - Disabled for universal access
    pythonBackend: {
        baseUrl: 'http://localhost:5000/api',  // Change to your deployed URL
        enabled: false,  // Disabled to prioritize Google Sheets for universal access
        timeout: 30000
    },
    
    // Google Sheets (Primary) - Universal access
    googleSheets: {
        apiKey: 'AIzaSyBSxmmqw67fC349cpfVJ6ZltHo3wmdcGgE',
        spreadsheetId: '1jqf7JFYbtaQxWla3TdYqLnpcnPmAbDIYOvn8PruO13M',
        webAppUrl: 'https://script.google.com/macros/s/AKfycbzWWxWjp7gMy7D1NzAR_PJQ0yEm2P1CqapWfmxz8seMfRFXXKELTMOfWgD2SXxhvgYemw/exec',
        enabled: true
    },
    
    // Local Storage (Tertiary)
    localStorage: {
        enabled: true,
        key: 'mpr_data_backup'
    }
};

// Data structure
var appData = {
    weeklyReports: {},
    adminCredentials: {
        'admin': 'mpr2025'
    },
    teamMembers: [
        {
            id: 1,
            name: 'Ishaka Sheriff',
            role: 'ICF Country Lead',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
            pin: '1234'
        },
        {
            id: 2,
            name: 'Randwulf A.J. Tucker',
            role: 'ICF Consultant',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
            pin: '5678'
        },
        {
            id: 3,
            name: 'Alusine Mansaray',
            role: 'ICF COnsultant',
            avatar: 'https://images.unsplash.com/photo-1594824501085-4b1d66fc31fa?w=150&h=150&fit=crop&crop=face',
            pin: '9012'
        },
        {
            id: 4,
            name: 'Zainab Kamara',
            role: 'ICF Consultant',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
            pin: '3456'
        },
        {
            id: 5,
            name: 'Morlai Alimamy Kargbo',
            role: 'ICF Consultant',
            avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face',
            pin: '7890'
        },
        {
            id: 6,
            name: 'Lucy Henrietta Kawa',
            role: 'ICF Consultant',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            pin: '2468'
        },
        {
            id: 7,
            name: 'Hawanatu Ahyesa Sheriff',
            role: 'ICF Consultant',
            avatar: 'https://images.unsplash.com/photo-1594824501084-9be42d1b2ae8?w=150&h=150&fit=crop&crop=face',
            pin: '1357'
        },
        {
            id: 8,
            name: 'Angella Nyuma',
            role: 'ICF Consultant',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            pin: '9753'
        }
    ]
};

// Month data for 2025
var MONTHS_2025 = [
    { 
        number: 1, name: 'January', dueDate: '2025-01-31T23:59:59', days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-01-01', endDate: '2025-01-07', dueDate: '2025-01-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-01-08', endDate: '2025-01-14', dueDate: '2025-01-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-01-15', endDate: '2025-01-21', dueDate: '2025-01-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-01-22', endDate: '2025-01-31', dueDate: '2025-02-01T23:59:59' }
        ]
    },
    { 
        number: 2, name: 'February', dueDate: '2025-02-28T23:59:59', days: 28,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-02-01', endDate: '2025-02-07', dueDate: '2025-02-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-02-08', endDate: '2025-02-14', dueDate: '2025-02-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-02-15', endDate: '2025-02-21', dueDate: '2025-02-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-02-22', endDate: '2025-02-28', dueDate: '2025-03-01T23:59:59' }
        ]
    },
    { 
        number: 3, name: 'March', dueDate: '2025-03-31T23:59:59', days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-03-01', endDate: '2025-03-07', dueDate: '2025-03-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-03-08', endDate: '2025-03-14', dueDate: '2025-03-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-03-15', endDate: '2025-03-21', dueDate: '2025-03-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-03-22', endDate: '2025-03-31', dueDate: '2025-04-01T23:59:59' }
        ]
    },
    { 
        number: 4, name: 'April', dueDate: '2025-04-30T23:59:59', days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-04-01', endDate: '2025-04-07', dueDate: '2025-04-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-04-08', endDate: '2025-04-14', dueDate: '2025-04-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-04-15', endDate: '2025-04-21', dueDate: '2025-04-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-04-22', endDate: '2025-04-30', dueDate: '2025-05-01T23:59:59' }
        ]
    },
    { 
        number: 5, name: 'May', dueDate: '2025-05-31T23:59:59', days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-05-01', endDate: '2025-05-07', dueDate: '2025-05-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-05-08', endDate: '2025-05-14', dueDate: '2025-05-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-05-15', endDate: '2025-05-21', dueDate: '2025-05-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-05-22', endDate: '2025-05-31', dueDate: '2025-06-01T23:59:59' }
        ]
    },
    { 
        number: 6, name: 'June', dueDate: '2025-06-30T23:59:59', days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-06-01', endDate: '2025-06-07', dueDate: '2025-06-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-06-08', endDate: '2025-06-14', dueDate: '2025-06-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-06-15', endDate: '2025-06-21', dueDate: '2025-06-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-06-22', endDate: '2025-06-30', dueDate: '2025-07-01T23:59:59' }
        ]
    },
    { 
        number: 7, name: 'July', dueDate: '2025-07-31T23:59:59', days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-07-01', endDate: '2025-07-07', dueDate: '2025-07-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-07-08', endDate: '2025-07-14', dueDate: '2025-07-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-07-15', endDate: '2025-07-21', dueDate: '2025-07-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-07-22', endDate: '2025-07-31', dueDate: '2025-08-01T23:59:59' }
        ]
    },
    { 
        number: 8, name: 'August', dueDate: '2025-08-31T23:59:59', days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-08-01', endDate: '2025-08-07', dueDate: '2025-08-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-08-08', endDate: '2025-08-14', dueDate: '2025-08-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-08-15', endDate: '2025-08-21', dueDate: '2025-08-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-08-22', endDate: '2025-08-31', dueDate: '2025-09-01T23:59:59' }
        ]
    },
    { 
        number: 9, name: 'September', dueDate: '2025-09-30T23:59:59', days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-09-01', endDate: '2025-09-07', dueDate: '2025-09-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-09-08', endDate: '2025-09-14', dueDate: '2025-09-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-09-15', endDate: '2025-09-21', dueDate: '2025-09-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-09-22', endDate: '2025-09-30', dueDate: '2025-10-01T23:59:59' }
        ]
    },
    { 
        number: 10, name: 'October', dueDate: '2025-10-31T23:59:59', days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-10-01', endDate: '2025-10-07', dueDate: '2025-10-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-10-08', endDate: '2025-10-14', dueDate: '2025-10-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-10-15', endDate: '2025-10-21', dueDate: '2025-10-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-10-22', endDate: '2025-10-31', dueDate: '2025-11-01T23:59:59' }
        ]
    },
    { 
        number: 11, name: 'November', dueDate: '2025-11-30T23:59:59', days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-11-01', endDate: '2025-11-07', dueDate: '2025-11-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-11-08', endDate: '2025-11-14', dueDate: '2025-11-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-11-15', endDate: '2025-11-21', dueDate: '2025-11-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-11-22', endDate: '2025-11-30', dueDate: '2025-12-01T23:59:59' }
        ]
    },
    { 
        number: 12, name: 'December', dueDate: '2025-12-31T23:59:59', days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-12-01', endDate: '2025-12-07', dueDate: '2025-12-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-12-08', endDate: '2025-12-14', dueDate: '2025-12-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-12-15', endDate: '2025-12-21', dueDate: '2025-12-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-12-22', endDate: '2025-12-31', dueDate: '2026-01-01T23:59:59' }
        ]
    }
];

// ===== PYTHON BACKEND FUNCTIONS =====

async function saveDataToPythonBackend() {
    try {
        console.log('Saving data to Python backend...');
        showToast('Saving to GitHub via Python backend...', 'info');
        
        const dataToSave = {
            ...appData,
            lastUpdated: new Date().toISOString(),
            source: 'MPR_Web_App',
            version: (appData.version || 0) + 1
        };
        
        const response = await fetch(`${BACKUP_CONFIG.pythonBackend.baseUrl}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Data saved to Python backend successfully');
            showToast('Data saved to GitHub successfully!', 'success');
            return true;
        } else {
            throw new Error(result.error || 'Unknown error');
        }
        
    } catch (error) {
        console.error('Python backend save failed:', error);
        throw error;
    }
}

async function loadDataFromPythonBackend() {
    try {
        console.log('Loading data from Python backend...');
        showToast('Loading from GitHub...', 'info');
        
        const response = await fetch(`${BACKUP_CONFIG.pythonBackend.baseUrl}/load`, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                console.log('No data found in GitHub');
                return false;
            }
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            mergeLoadedData(result.data, 'GitHub');
            return true;
        } else {
            throw new Error(result.error || 'No data returned');
        }
        
    } catch (error) {
        console.error('Python backend load failed:', error);
        throw error;
    }
}

async function testPythonBackendConnection() {
    try {
        const response = await fetch(`${BACKUP_CONFIG.pythonBackend.baseUrl}/test`, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Python backend connection: OK', result);
            return true;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
        
    } catch (error) {
        console.error('Python backend connection failed:', error);
        return false;
    }
}

// ===== GOOGLE SHEETS FUNCTIONS =====

async function saveDataToGoogleSheets() {
    try {
        console.log('Saving data to Google Sheets...');
        showToast('Saving to Google Sheets...', 'info');
        
        const dataToSave = JSON.stringify(appData, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        });
        
        const prefixedData = 'MPR_DATA' + dataToSave;
        
        const formData = new FormData();
        formData.append('spreadsheetId', BACKUP_CONFIG.googleSheets.spreadsheetId);
        formData.append('data', prefixedData);
        formData.append('timestamp', new Date().toISOString());
        formData.append('action', 'save');
        
        const response = await fetch(BACKUP_CONFIG.googleSheets.webAppUrl, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.text();
        
        if (result.includes('SUCCESS')) {
            console.log('Data saved to Google Sheets successfully');
            showToast('Data saved to Google Sheets!', 'success');
            return true;
        } else {
            throw new Error(result.replace('ERROR: ', ''));
        }
        
    } catch (error) {
        console.error('Google Sheets save failed:', error);
        throw error;
    }
}

async function loadDataFromGoogleSheets() {
    try {
        console.log('Loading data from Google Sheets...');
        
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${BACKUP_CONFIG.googleSheets.spreadsheetId}/values/MPRData!A1:E10?key=${BACKUP_CONFIG.googleSheets.apiKey}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Sheets API failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            const dataCell = data.values[1] && data.values[1][1];
            if (dataCell) {
                let jsonString = dataCell;
                if (dataCell.startsWith('MPR_DATA{')) {
                    jsonString = dataCell.substring(8);
                }
                
                const jsonData = JSON.parse(jsonString);
                mergeLoadedData(jsonData, 'Google Sheets');
                return true;
            }
        }
        
        console.log('No data found in Google Sheets');
        return false;
        
    } catch (error) {
        console.error('Google Sheets load failed:', error);
        throw error;
    }
}

// ===== LOCAL STORAGE FUNCTIONS =====

function saveToLocalStorage() {
    try {
        const dataToSave = JSON.stringify(appData, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        });
        
        localStorage.setItem(BACKUP_CONFIG.localStorage.key, dataToSave);
        localStorage.setItem(BACKUP_CONFIG.localStorage.key + '_timestamp', new Date().toISOString());
        
        console.log('Data saved to local storage');
        return true;
    } catch (error) {
        console.error('Local storage save failed:', error);
        return false;
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(BACKUP_CONFIG.localStorage.key);
        const timestamp = localStorage.getItem(BACKUP_CONFIG.localStorage.key + '_timestamp');
        
        if (savedData) {
            const jsonData = JSON.parse(savedData);
            mergeLoadedData(jsonData, 'Local Storage');
            
            if (timestamp) {
                showToast(`Data loaded from local backup (${new Date(timestamp).toLocaleDateString()})`, 'info');
            }
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Local storage load failed:', error);
        return false;
    }
}

// ===== UNIFIED SAVE/LOAD FUNCTIONS =====

async function saveDataWithMultipleBackups() {
    console.log('Starting multi-backup save process...');
    let successCount = 0;
    let lastError = null;
    
    // Save to local storage first (always works)
    if (BACKUP_CONFIG.localStorage.enabled) {
        if (saveToLocalStorage()) {
            successCount++;
        }
    }
    
    // Try Python backend
    if (BACKUP_CONFIG.pythonBackend.enabled) {
        try {
            if (await saveDataToPythonBackend()) {
                successCount++;
            }
        } catch (error) {
            lastError = error;
            console.log('Python backend save failed, trying Google Sheets...');
        }
    }
    
    // Try Google Sheets if Python failed or is disabled
    if (BACKUP_CONFIG.googleSheets.enabled && successCount < 2) {
        try {
            if (await saveDataToGoogleSheets()) {
                successCount++;
            }
        } catch (error) {
            lastError = error;
            console.log('Google Sheets save also failed');
        }
    }
    
    // Provide feedback
    if (successCount === 0) {
        showToast('All save methods failed! Data only in browser memory.', 'error');
        downloadBackup(); // Emergency download
    } else if (successCount === 1) {
        showToast('Data saved to 1 location. Some backups failed.', 'warning');
    } else {
        showToast(`Data successfully saved to ${successCount} locations!`, 'success');
    }
    
    console.log(`Save completed: ${successCount} successful saves`);
}

async function loadDataWithFallbacks() {
    console.log('Starting data load with fallbacks...');
    let loadedFrom = null;
    
    // Try Python backend first
    if (BACKUP_CONFIG.pythonBackend.enabled) {
        try {
            if (await loadDataFromPythonBackend()) {
                loadedFrom = 'Python Backend (GitHub)';
            }
        } catch (error) {
            console.log('Python backend load failed, trying Google Sheets...');
        }
    }
    
    // Try Google Sheets if Python failed
    if (!loadedFrom && BACKUP_CONFIG.googleSheets.enabled) {
        try {
            if (await loadDataFromGoogleSheets()) {
                loadedFrom = 'Google Sheets';
            }
        } catch (error) {
            console.log('Google Sheets load failed, trying local storage...');
        }
    }
    
    // Try local storage as last resort
    if (!loadedFrom && BACKUP_CONFIG.localStorage.enabled) {
        if (loadFromLocalStorage()) {
            loadedFrom = 'Local Storage';
        }
    }
    
    if (loadedFrom) {
        console.log(`Data loaded from: ${loadedFrom}`);
        showToast(`Data loaded from ${loadedFrom}`, 'success');
    } else {
        console.log('No data found in any location, using defaults');
        showToast('No existing data found - starting fresh', 'info');
    }
}

// ===== HELPER FUNCTIONS =====

function mergeLoadedData(loadedData, source) {
    console.log(`Merging data from ${source}:`, loadedData);
    
    // Convert dates
    convertDatesInObject(loadedData);
    
    // Merge data structures
    if (loadedData.weeklyReports) {
        appData.weeklyReports = mergeWeeklyReports(appData.weeklyReports, loadedData.weeklyReports);
    }
    
    if (loadedData.teamMembers && Array.isArray(loadedData.teamMembers)) {
        appData.teamMembers = mergeTeamMembers(appData.teamMembers, loadedData.teamMembers);
    }
    
    if (loadedData.adminCredentials) {
        appData.adminCredentials = { ...appData.adminCredentials, ...loadedData.adminCredentials };
    }
    
    // Update metadata
    appData.lastLoaded = new Date().toISOString();
    appData.loadedFrom = source;
    
    // Count reports
    const reportCount = countSubmittedReports(appData.weeklyReports);
    console.log(`Merged data: ${reportCount} reports found`);
    
    // Update UI if logged in
    if (isAdminLoggedIn) {
        renderMonths();
        updateStats();
    }
}

function mergeWeeklyReports(existing, loaded) {
    const merged = { ...existing };
    
    Object.keys(loaded).forEach(month => {
        if (!merged[month]) merged[month] = {};
        
        Object.keys(loaded[month]).forEach(week => {
            if (!merged[month][week]) merged[month][week] = {};
            
            Object.keys(loaded[month][week]).forEach(userId => {
                merged[month][week][userId] = loaded[month][week][userId];
            });
        });
    });
    
    return merged;
}

function mergeTeamMembers(existing, loaded) {
    const merged = [...existing];
    
    loaded.forEach(loadedMember => {
        const existingIndex = merged.findIndex(member => member.id === loadedMember.id);
        if (existingIndex >= 0) {
            merged[existingIndex] = { ...merged[existingIndex], ...loadedMember };
        } else {
            merged.push(loadedMember);
        }
    });
    
    return merged;
}

function convertDatesInObject(obj) {
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (key === 'submittedDate' && typeof obj[key] === 'string') {
                try {
                    obj[key] = new Date(obj[key]);
                } catch (error) {
                    console.warn('Failed to convert date:', obj[key]);
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                convertDatesInObject(obj[key]);
            }
        }
    }
}

function countSubmittedReports(weeklyReports) {
    let count = 0;
    Object.keys(weeklyReports).forEach(month => {
        Object.keys(weeklyReports[month]).forEach(week => {
            Object.keys(weeklyReports[month][week]).forEach(userId => {
                if (weeklyReports[month][week][userId]?.submitted) {
                    count++;
                }
            });
        });
    });
    return count;
}

function downloadBackup() {
    try {
        const dataToSave = JSON.stringify(appData, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        }, 2);

        const blob = new Blob([dataToSave], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mpr-emergency-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Emergency backup downloaded');
        showToast('Emergency backup file downloaded', 'info');
    } catch (error) {
        console.error('Emergency backup failed:', error);
    }
}

// ===== UTILITY FUNCTIONS =====

function getCurrentMonth() {
    return new Date().getMonth() + 1;
}

function getCurrentWeek() {
    var now = new Date();
    var currentMonthNum = getCurrentMonth();
    var month = MONTHS_2025.find(m => m.number === currentMonthNum);
    
    if (!month) return 1;
    
    for (var week of month.weeks) {
        var startDate = new Date(week.startDate);
        var endDate = new Date(week.endDate);
        if (now >= startDate && now <= endDate) {
            return week.number;
        }
    }
    return 1;
}

function getWeekStatus(week) {
    var now = new Date();
    var dueDate = new Date(week.dueDate);
    var startDate = new Date(week.startDate);
    var endDate = new Date(week.endDate);
    
    if (now >= startDate && now <= endDate) {
        return 'current';
    } else if (now > dueDate) {
        return 'overdue';
    } else if (now < startDate) {
        return 'upcoming';
    } else {
        return 'active';
    }
}

function getUserReport(userId, monthNumber, weekNumber) {
    if (!appData.weeklyReports[monthNumber]) {
        appData.weeklyReports[monthNumber] = {};
    }
    if (!appData.weeklyReports[monthNumber][weekNumber]) {
        appData.weeklyReports[monthNumber][weekNumber] = {};
    }
    return appData.weeklyReports[monthNumber][weekNumber][userId];
}

function setUserReport(userId, monthNumber, weekNumber, report) {
    if (!appData.weeklyReports[monthNumber]) {
        appData.weeklyReports[monthNumber] = {};
    }
    if (!appData.weeklyReports[monthNumber][weekNumber]) {
        appData.weeklyReports[monthNumber][weekNumber] = {};
    }
    appData.weeklyReports[monthNumber][weekNumber][userId] = report;
}

function getUserStatus(userId, monthNumber, weekNumber) {
    var report = getUserReport(userId, monthNumber, weekNumber);
    var month = MONTHS_2025.find(m => m.number === monthNumber);
    var week = month ? month.weeks.find(w => w.number === weekNumber) : null;
    var now = new Date();
    var dueDate = new Date(week.dueDate);
    
    if (report && report.submitted) {
        return 'submitted';
    } else if (now > dueDate) {
        return 'overdue';
    } else {
        return 'pending';
    }
}

// ===== MODAL FUNCTIONS =====

function showPinModal(userId) {
    var user = appData.teamMembers.find(u => u.id === userId);
    var month = MONTHS_2025.find(m => m.number === currentMonth);
    var week = month ? month.weeks.find(w => w.number === currentWeek) : null;
    
    if (!user || !week) return;

    var status = getUserStatus(userId, currentMonth, currentWeek);
    if (status === 'overdue' && !getUserReport(userId, currentMonth, currentWeek)) {
        showToast('The deadline has passed. You can no longer submit reports.', 'error');
        return;
    }

    currentUser = user;
    document.getElementById('pinUserName').textContent = `Hello ${user.name}, please enter your 4-digit PIN to submit your ${month.name} 2025 ${week.name} report`;
    document.getElementById('pinModal').style.display = 'flex';
    setTimeout(() => document.getElementById('userPin').focus(), 100);
}

function closePinModal() {
    document.getElementById('pinModal').style.display = 'none';
    document.getElementById('userPin').value = '';
    document.getElementById('pinErrorMessage').style.display = 'none';
}

function verifyPin() {
    var pin = document.getElementById('userPin').value;
    var errorMessage = document.getElementById('pinErrorMessage');
    
    errorMessage.style.display = 'none';

    if (!pin || pin.length !== 4) {
        errorMessage.textContent = 'Please enter a 4-digit PIN.';
        errorMessage.style.display = 'block';
        return;
    }

    if (currentUser && currentUser.pin === pin) {
        closePinModal();
        showReportModal();
    } else {
        errorMessage.style.display = 'block';
        document.getElementById('userPin').value = '';
        document.getElementById('userPin').focus();
    }
}

function showReportModal() {
    if (!currentUser || !currentMonth || !currentWeek) return;

    var month = MONTHS_2025.find(m => m.number === currentMonth);
    var week = month ? month.weeks.find(w => w.number === currentWeek) : null;
    var existingReport = getUserReport(currentUser.id, currentMonth, currentWeek);

    document.getElementById('reportUserName').textContent = `${currentUser.name} - ${month.name} 2025 ${week.name} Report`;
    
    // Pre-fill existing data if available
    const fields = ['activitiesCompleted', 'keyAchievements', 'challengesFaced', 'lessonsLearned', 'nextWeekPlans', 'supportNeeded', 'additionalComments'];
    
    fields.forEach(field => {
        document.getElementById(field).value = existingReport ? (existingReport[field] || '') : '';
    });
    
    document.getElementById('reportModal').style.display = 'flex';
    setTimeout(() => document.getElementById('activitiesCompleted').focus(), 100);
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
    document.getElementById('reportErrorMessage').style.display = 'none';
}

async function submitReport() {
    const fields = {
        activitiesCompleted: document.getElementById('activitiesCompleted').value.trim(),
        keyAchievements: document.getElementById('keyAchievements').value.trim(),
        challengesFaced: document.getElementById('challengesFaced').value.trim(),
        lessonsLearned: document.getElementById('lessonsLearned').value.trim(),
        nextWeekPlans: document.getElementById('nextWeekPlans').value.trim(),
        supportNeeded: document.getElementById('supportNeeded').value.trim(),
        additionalComments: document.getElementById('additionalComments').value.trim()
    };
    
    const errorMessage = document.getElementById('reportErrorMessage');
    errorMessage.style.display = 'none';

    if (!fields.activitiesCompleted || !fields.keyAchievements || !fields.nextWeekPlans) {
        errorMessage.textContent = 'Please fill in all required fields (Activities, Achievements, and Next Week Plans).';
        errorMessage.style.display = 'block';
        return;
    }

    if (currentUser && currentMonth && currentWeek) {
        const report = {
            submitted: true,
            submittedDate: new Date(),
            ...fields
        };

        console.log('Saving report for user:', currentUser.name, 'Month:', currentMonth, 'Week:', currentWeek);
        setUserReport(currentUser.id, currentMonth, currentWeek, report);

        // Save with multiple backups
        await saveDataWithMultipleBackups();

        closeReportModal();
        renderUsersGrid();
        renderWeeksGrid();
        renderMonths();
        updateStats();
        
        const month = MONTHS_2025.find(m => m.number === currentMonth);
        const week = month.weeks.find(w => w.number === currentWeek);
        showToast(`${month.name} 2025 ${week.name} report submitted successfully for ${currentUser.name}!`, 'success');
    }
}

function showUserSummary(userId) {
    var user = appData.teamMembers.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('summaryUserName').textContent = `${user.name} - Complete Report History`;
    
    // Collect all reports for this user
    var userReports = [];
    MONTHS_2025.forEach(month => {
        month.weeks.forEach(week => {
            var report = getUserReport(userId, month.number, week.number);
            if (report && report.submitted) {
                userReports.push({ month, week, report });
            }
        });
    });

    // Generate summary HTML
    var summaryHtml = '';

    if (userReports.length === 0) {
        summaryHtml = `<div class="no-reports-message"><h3>No Reports Submitted Yet</h3><p>${user.name} hasn't submitted any weekly reports yet.</p></div>`;
    } else {
        var totalPossibleReports = 12 * 4;
        
        summaryHtml += '<div class="summary-stats">';
        summaryHtml += `<div class="summary-stat"><span class="summary-stat-number">${userReports.length}</span><span class="summary-stat-label">Reports Submitted</span></div>`;
        summaryHtml += `<div class="summary-stat"><span class="summary-stat-number">${totalPossibleReports - userReports.length}</span><span class="summary-stat-label">Pending</span></div>`;
        summaryHtml += `<div class="summary-stat"><span class="summary-stat-number">${Math.round((userReports.length / totalPossibleReports) * 100)}%</span><span class="summary-stat-label">Completion Rate</span></div>`;
        summaryHtml += '</div>';

        userReports.forEach(reportData => {
            var startDate = new Date(reportData.week.startDate).toLocaleDateString();
            var endDate = new Date(reportData.week.endDate).toLocaleDateString();
            var submittedDate = reportData.report.submittedDate;
            if (typeof submittedDate === 'string') {
                submittedDate = new Date(submittedDate);
            }
            
            summaryHtml += '<div class="report-summary-card">';
            summaryHtml += `<div class="report-month-header"><div class="report-month-title">${reportData.month.name} 2025 - ${reportData.week.name}</div><div class="report-date">Period: ${startDate} - ${endDate}<br>Submitted: ${submittedDate.toLocaleDateString()}</div></div>`;
            summaryHtml += `<div class="report-section"><div class="report-section-title">Activities Completed</div><div class="report-section-content">${reportData.report.activitiesCompleted}</div></div>`;
            summaryHtml += `<div class="report-section"><div class="report-section-title">Key Achievements</div><div class="report-section-content">${reportData.report.keyAchievements}</div></div>`;
            
            if (reportData.report.challengesFaced) {
                summaryHtml += `<div class="report-section"><div class="report-section-title">Challenges Faced</div><div class="report-section-content">${reportData.report.challengesFaced}</div></div>`;
            }
            
            if (reportData.report.lessonsLearned) {
                summaryHtml += `<div class="report-section"><div class="report-section-title">Lessons Learned</div><div class="report-section-content">${reportData.report.lessonsLearned}</div></div>`;
            }
            
            summaryHtml += `<div class="report-section"><div class="report-section-title">Next Week Plans</div><div class="report-section-content">${reportData.report.nextWeekPlans}</div></div>`;
            
            if (reportData.report.supportNeeded) {
                summaryHtml += `<div class="report-section"><div class="report-section-title">Support Needed</div><div class="report-section-content">${reportData.report.supportNeeded}</div></div>`;
            }
            
            if (reportData.report.additionalComments) {
                summaryHtml += `<div class="report-section"><div class="report-section-title">Additional Comments</div><div class="report-section-content">${reportData.report.additionalComments}</div></div>`;
            }
            
            summaryHtml += '</div>';
        });
    }

    document.getElementById('summaryContent').innerHTML = summaryHtml;
    document.getElementById('summaryModal').style.display = 'flex';
}

function closeSummaryModal() {
    document.getElementById('summaryModal').style.display = 'none';
}

function viewUserReport(userId) {
    var user = appData.teamMembers.find(u => u.id === userId);
    var report = getUserReport(userId, currentMonth, currentWeek);
    var month = MONTHS_2025.find(m => m.number === currentMonth);
    var week = month ? month.weeks.find(w => w.number === currentWeek) : null;
    
    if (!user || !report || !report.submitted) return;

    var startDate = new Date(week.startDate).toLocaleDateString();
    var endDate = new Date(week.endDate).toLocaleDateString();
    var submittedDate = report.submittedDate;
    if (typeof submittedDate === 'string') {
        submittedDate = new Date(submittedDate);
    }

    var reportDetails = `${month.name} 2025 - ${week.name} Report\n\n`;
    reportDetails += `Name: ${user.name}\n`;
    reportDetails += `Role: ${user.role}\n`;
    reportDetails += `Week Period: ${startDate} - ${endDate}\n`;
    reportDetails += `Submitted: ${submittedDate.toLocaleString()}\n\n`;
    reportDetails += `ACTIVITIES COMPLETED:\n${report.activitiesCompleted}\n\n`;
    reportDetails += `KEY ACHIEVEMENTS:\n${report.keyAchievements}\n\n`;
    
    if (report.challengesFaced) {
        reportDetails += `CHALLENGES FACED:\n${report.challengesFaced}\n\n`;
    }
    
    if (report.lessonsLearned) {
        reportDetails += `LESSONS LEARNED:\n${report.lessonsLearned}\n\n`;
    }
    
    reportDetails += `NEXT WEEK PLANS:\n${report.nextWeekPlans}\n\n`;
    
    if (report.supportNeeded) {
        reportDetails += `SUPPORT NEEDED:\n${report.supportNeeded}\n\n`;
    }
    
    if (report.additionalComments) {
        reportDetails += `ADDITIONAL COMMENTS:\n${report.additionalComments}\n`;
    }

    alert(reportDetails);
}

// ===== RENDERING FUNCTIONS =====

function renderUsersGrid() {
    var grid = document.getElementById('usersGrid');
    grid.innerHTML = '';

    appData.teamMembers.forEach(user => {
        var status = getUserStatus(user.id, currentMonth, currentWeek);
        var card = document.createElement('div');
        card.className = `user-card ${status}`;
        
        var statusBadge = '';
        var actionButtons = '';

        switch (status) {
            case 'submitted':
                statusBadge = '<span class="user-status status-submitted">✅ Submitted</span>';
                actionButtons = `<button class="btn btn-secondary" onclick="viewUserReport(${user.id})">👁️ View Report</button><button class="btn btn-secondary" onclick="showUserSummary(${user.id})">📊 View Summary</button>`;
                break;
            case 'overdue':
                statusBadge = '<span class="user-status status-overdue">⚠️ Overdue</span>';
                actionButtons = `<button class="btn btn-warning" disabled>🔒 Deadline Passed</button><button class="btn btn-secondary" onclick="showUserSummary(${user.id})">📊 View Summary</button>`;
                break;
            default:
                statusBadge = '<span class="user-status status-pending">⏳ Pending</span>';
                actionButtons = `<button class="btn btn-primary" onclick="showPinModal(${user.id})">📝 Fill Report</button><button class="btn btn-secondary" onclick="showUserSummary(${user.id})">📊 View Summary</button>`;
        }

        card.innerHTML = `<div class="user-header"><img src="${user.avatar}" alt="${user.name}" class="user-avatar"><div class="user-info"><div class="user-name">${user.name}</div><div class="user-role">${user.role}</div>${statusBadge}</div></div><div class="user-actions">${actionButtons}</div>`;

        grid.appendChild(card);
    });
}

function renderWeeksGrid() {
    var grid = document.getElementById('weeksGrid');
    grid.innerHTML = '';

    var month = MONTHS_2025.find(m => m.number === currentMonth);
    if (!month) return;

    month.weeks.forEach(week => {
        var status = getWeekStatus(week);
        var startDate = new Date(week.startDate);
        var endDate = new Date(week.endDate);
        var dueDate = new Date(week.dueDate);
        
        // Count reports for this week
        var weekReports = (appData.weeklyReports[currentMonth] && appData.weeklyReports[currentMonth][week.number]) ? appData.weeklyReports[currentMonth][week.number] : {};
        var submittedCount = Object.keys(weekReports).filter(key => weekReports[key] && weekReports[key].submitted).length;
        
        var card = document.createElement('div');
        card.className = `week-card ${status}`;
        card.onclick = () => openWeekModal(week.number);
        
        var statusBadge = '';
        var statusColor = '';
        var dueDateClass = '';
        
        switch (status) {
            case 'current':
                statusBadge = '📅 Current Week';
                statusColor = 'week-status-current';
                dueDateClass = 'current';
                break;
            case 'overdue':
                statusBadge = '⚠️ Overdue';
                statusColor = 'week-status-overdue';
                dueDateClass = 'overdue';
                break;
            case 'upcoming':
                statusBadge = '⏰ Upcoming';
                statusColor = 'week-status-upcoming';
                dueDateClass = '';
                break;
            default:
                statusBadge = '✅ Active';
                statusColor = 'week-status-active';
                dueDateClass = '';
        }

        card.innerHTML = `<div class="week-header"><div class="week-info"><div class="week-name">${week.name}</div><div class="week-period">${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</div></div><div class="week-due-date"><span class="week-due-label">Due Date</span><div class="week-due-value ${dueDateClass}">${dueDate.toLocaleDateString()}</div></div></div><div class="week-status-badge ${statusColor}">${statusBadge}</div><div class="week-summary"><div class="week-summary-item"><span class="week-summary-number">${submittedCount}</span><span class="week-summary-label">Submitted</span></div><div class="week-summary-item"><span class="week-summary-number">${appData.teamMembers.length}</span><span class="week-summary-label">Total Users</span></div><div class="week-summary-item"><span class="week-summary-number">${Math.round((submittedCount / appData.teamMembers.length) * 100)}%</span><span class="week-summary-label">Complete</span></div></div><div style="text-align: center; color: #8b949e; font-size: 12px; font-style: italic; margin-top: 10px;">👆 Click to manage reports</div>`;

        grid.appendChild(card);
    });
}

function renderMonths() {
    var grid = document.getElementById('monthsGrid');
    grid.innerHTML = '';

    MONTHS_2025.forEach(month => {
        // Count reports for this month
        var monthSubmittedCount = 0;
        var totalPossibleReports = appData.teamMembers.length * 4;
        
        month.weeks.forEach(week => {
            var weekReports = (appData.weeklyReports[month.number] && appData.weeklyReports[month.number][week.number]) ? appData.weeklyReports[month.number][week.number] : {};
            monthSubmittedCount += Object.keys(weekReports).filter(key => weekReports[key] && weekReports[key].submitted).length;
        });
        
        var card = document.createElement('div');
        card.className = 'month-card';
        card.onclick = () => openMonthModal(month.number);
        
        var currentMonthNum = getCurrentMonth();
        var monthStatus = '';
        var statusColor = '';
        
        if (month.number === currentMonthNum) {
            monthStatus = '📅 Current Month';
            statusColor = 'status-current';
            card.classList.add('current-month');
        } else if (month.number < currentMonthNum) {
            monthStatus = '✅ Completed';
            statusColor = 'status-active';
        } else {
            monthStatus = '⏰ Upcoming';
            statusColor = 'status-upcoming';
        }

        card.innerHTML = `<div class="month-header"><div class="month-info"><div class="month-name">${month.name}</div><div class="month-year">2025</div></div><div class="due-date-info"><span class="due-date-label">4 Weeks</span><div class="due-date">${month.weeks.length} weeks</div></div></div><div class="month-status"><span class="status-badge ${statusColor}">${monthStatus}</span></div><div class="reports-summary"><div class="summary-item"><span class="summary-number">${monthSubmittedCount}</span><span class="summary-label">Submitted</span></div><div class="summary-item"><span class="summary-number">${totalPossibleReports}</span><span class="summary-label">Total Reports</span></div><div class="summary-item"><span class="summary-number">${Math.round((monthSubmittedCount / totalPossibleReports) * 100)}%</span><span class="summary-label">Complete</span></div></div><div class="click-hint">👆 Click to manage weekly reports</div>`;

        grid.appendChild(card);
    });
}

function updateStats() {
    var totalReports = 0;
    Object.keys(appData.weeklyReports).forEach(month => {
        Object.keys(appData.weeklyReports[month]).forEach(week => {
            Object.keys(appData.weeklyReports[month][week]).forEach(user => {
                if (appData.weeklyReports[month][week][user] && appData.weeklyReports[month][week][user].submitted) {
                    totalReports++;
                }
            });
        });
    });

    var currentMonthNum = getCurrentMonth();
    var currentMonthName = MONTHS_2025.find(m => m.number === currentMonthNum)?.name || 'Unknown';
    
    document.getElementById('totalReports').textContent = totalReports;
    document.getElementById('currentMonth').textContent = `${currentMonthName} 2025`;
}

function openMonthModal(monthNumber) {
    var month = MONTHS_2025.find(m => m.number === monthNumber);
    if (!month) return;

    currentMonth = monthNumber;
    document.getElementById('weeksModalTitle').textContent = `${month.name} 2025 - Weekly Reports`;
    document.getElementById('weeksModalSubtitle').textContent = 'Select a week to manage team reports';

    renderWeeksGrid();
    document.getElementById('weeksModal').style.display = 'flex';
}

function closeWeeksModal() {
    document.getElementById('weeksModal').style.display = 'none';
    currentMonth = null;
}

function openWeekModal(weekNumber) {
    var month = MONTHS_2025.find(m => m.number === currentMonth);
    var week = month ? month.weeks.find(w => w.number === weekNumber) : null;
    if (!week) return;

    currentWeek = weekNumber;
    document.getElementById('usersModalTitle').textContent = `${month.name} 2025 - ${week.name} - Team Reports`;
    
    var status = getWeekStatus(week);
    var startDate = new Date(week.startDate).toLocaleDateString();
    var endDate = new Date(week.endDate).toLocaleDateString();
    var dueDate = new Date(week.dueDate).toLocaleDateString();
    
    if (status === 'overdue') {
        document.getElementById('usersModalSubtitle').textContent = `Deadline passed (${dueDate}) - View submitted reports only`;
    } else {
        document.getElementById('usersModalSubtitle').textContent = `Week Period: ${startDate} - ${endDate} | Due: ${dueDate} - Click on a team member to submit their weekly report`;
    }

    renderUsersGrid();
    document.getElementById('usersModal').style.display = 'flex';
}

function closeUsersModal() {
    document.getElementById('usersModal').style.display = 'none';
    currentWeek = null;
}

function showAdminLoginModal() {
    document.getElementById('adminLoginModal').style.display = 'flex';
    setTimeout(() => document.getElementById('adminUsername').focus(), 100);
}

function hideAdminLoginModal() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

async function adminLogin() {
    const user = document.getElementById('adminUsername').value.trim();
    const pass = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('adminErrorMessage');
    
    errorMessage.style.display = 'none';

    if (!user || !pass) {
        errorMessage.textContent = 'Please enter both username and password.';
        errorMessage.style.display = 'block';
        return;
    }

    if (appData.adminCredentials[user] && appData.adminCredentials[user] === pass) {
        isAdminLoggedIn = true;
        hideAdminLoginModal();
        
        showToast('Testing connections and loading data...', 'info');
        
        try {
            // Test connections and load data
            if (BACKUP_CONFIG.pythonBackend.enabled) {
                const backendOk = await testPythonBackendConnection();
                if (backendOk) {
                    showToast('Python backend connected successfully', 'success');
                }
            }
            
            await loadDataWithFallbacks();
            
        } catch (error) {
            console.error('Error during login:', error);
            showToast('Login successful, but some data loading failed', 'warning');
        }
        
        showIntroVideo();
        
        document.getElementById('currentUser').textContent = user;
        document.getElementById('adminInfo').style.display = 'block';
        
        // Clear form
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        
    } else {
        errorMessage.style.display = 'block';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminUsername').focus();
    }
}

function showIntroVideo() {
    var overlay = document.getElementById('introOverlay');
    var mainContent = document.getElementById('mainContent');
    
    overlay.style.display = 'flex';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        mainContent.classList.remove('main-content-hidden');
        mainContent.classList.add('main-content-visible');
        
        renderMonths();
        updateStats();
        showToast('Welcome to MPR 2025 Weekly Reports - Powered by ICF-SL');
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Save before logout
        saveDataWithMultipleBackups();
        
        isAdminLoggedIn = false;
        document.getElementById('adminInfo').style.display = 'none';
        document.getElementById('monthsGrid').innerHTML = '';
        document.getElementById('mainContent').classList.remove('main-content-visible');
        document.getElementById('mainContent').classList.add('main-content-hidden');
        showAdminLoginModal();
        showToast('Logged out successfully.');
    }
}

function showToast(message, type) {
    if (currentToast) {
        clearTimeout(currentToast);
    }

    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type === 'error') {
        toast.className += ' error';
    } else if (type === 'warning') {
        toast.className += ' warning';
    } else if (type === 'success') {
        toast.className += ' success';
    } else if (type === 'info') {
        toast.className += ' info';
    }
    
    toast.classList.add('show');
    
    currentToast = setTimeout(() => {
        toast.classList.remove('show');
        currentToast = null;
    }, 4000);
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const pinInput = document.getElementById('userPin');
    
    if (adminUsernameInput) {
        adminUsernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adminLogin();
            }
        });
    }
    
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adminLogin();
            }
        });
    }

    if (pinInput) {
        pinInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyPin();
            }
        });

        pinInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('usersModal').style.display === 'flex') {
                closeUsersModal();
            } else if (document.getElementById('weeksModal').style.display === 'flex') {
                closeWeeksModal();
            } else if (document.getElementById('pinModal').style.display === 'flex') {
                closePinModal();
            } else if (document.getElementById('reportModal').style.display === 'flex') {
                closeReportModal();
            } else if (document.getElementById('summaryModal').style.display === 'flex') {
                closeSummaryModal();
            }
        }
    });

    // Auto-save every 5 minutes if logged in
    setInterval(() => {
        if (isAdminLoggedIn) {
            console.log('Auto-saving data...');
            saveToLocalStorage(); // Quick local save
        }
    }, 5 * 60 * 1000); // 5 minutes

    // Show admin login modal initially
    if (!isAdminLoggedIn) {
        showAdminLoginModal();
    }
    
    console.log('MPR Application initialized successfully');
    console.log('Backup methods available:', {
        pythonBackend: BACKUP_CONFIG.pythonBackend.enabled,
        googleSheets: BACKUP_CONFIG.googleSheets.enabled,
        localStorage: BACKUP_CONFIG.localStorage.enabled
    });
});

// ===== DEBUG AND TESTING FUNCTIONS =====

// Test all backup methods (for debugging)
async function testAllBackupMethods() {
    console.log('=== Testing All Backup Methods ===');
    
    // Test Python Backend
    if (BACKUP_CONFIG.pythonBackend.enabled) {
        console.log('Testing Python Backend...');
        const pythonOk = await testPythonBackendConnection();
        console.log('Python Backend:', pythonOk ? 'OK' : 'FAILED');
    }
    
    // Test Local Storage
    if (BACKUP_CONFIG.localStorage.enabled) {
        console.log('Testing Local Storage...');
        const localOk = saveToLocalStorage();
        console.log('Local Storage:', localOk ? 'OK' : 'FAILED');
    }
    
    // Test Google Sheets (if configured)
    if (BACKUP_CONFIG.googleSheets.enabled && BACKUP_CONFIG.googleSheets.webAppUrl !== 'https://script.google.com/macros/s/YOUR_WEB_APP_URL_HERE/exec') {
        console.log('Testing Google Sheets...');
        try {
            await saveDataToGoogleSheets();
            console.log('Google Sheets: OK');
        } catch (error) {
            console.log('Google Sheets: FAILED -', error.message);
        }
    }
    
    console.log('=== Test Complete ===');
}

// Force save to all available methods
async function forceSaveToAll() {
    console.log('Force saving to all methods...');
    await saveDataWithMultipleBackups();
}

// Show backup status
function showBackupStatus() {
    const status = {
        pythonBackend: BACKUP_CONFIG.pythonBackend.enabled ? 'Enabled' : 'Disabled',
        googleSheets: BACKUP_CONFIG.googleSheets.enabled ? 'Enabled' : 'Disabled',
        localStorage: BACKUP_CONFIG.localStorage.enabled ? 'Enabled' : 'Disabled',
        lastSaved: appData.lastUpdated || 'Never',
        totalReports: countSubmittedReports(appData.weeklyReports)
    };
    
    console.table(status);
    
    // Show in UI
    const statusMessage = `Backup Status:
- Python Backend (GitHub): ${status.pythonBackend}
- Google Sheets: ${status.googleSheets}
- Local Storage: ${status.localStorage}
- Last Saved: ${status.lastSaved}
- Total Reports: ${status.totalReports}`;
    
    alert(statusMessage);
}

// Export functions for debugging (attach to window for console access)
if (typeof window !== 'undefined') {
    window.MPR_DEBUG = {
        testAllBackupMethods,
        forceSaveToAll,
        showBackupStatus,
        saveDataWithMultipleBackups,
        loadDataWithFallbacks,
        appData
    };
    
    console.log('Debug functions available via window.MPR_DEBUG');
}
