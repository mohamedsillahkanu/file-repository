// Replace these functions in your main JavaScript file

// Google Sheets configuration - UPDATE THIS WEB APP URL
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'AIzaSyBSxmmqw67fC349cpfVJ6ZltHo3wmdcGgE',
    spreadsheetId: '1jqf7JFYbtaQxWla3TdYqLnpcnPmAbDIYOvn8PruO13M',
    range: 'MPRData!A1:B1',
    // UPDATE THIS URL WITH YOUR NEW GOOGLE APPS SCRIPT WEB APP URL
    webAppUrl: 'https://script.google.com/macros/s/YOUR_NEW_WEB_APP_URL_HERE/exec'
};

// Enhanced load function that handles both Google Sheets API and Apps Script
async function loadDataFromSheets() {
    try {
        console.log('Starting data load from Google Sheets...');
        showToast('Loading saved data...', 'info');
        
        // Method 1: Try Google Apps Script first (more reliable)
        try {
            const gasResponse = await fetch(`${GOOGLE_SHEETS_CONFIG.webAppUrl}?spreadsheetId=${GOOGLE_SHEETS_CONFIG.spreadsheetId}&action=load`);
            
            if (gasResponse.ok) {
                const gasResult = await gasResponse.json();
                console.log('Google Apps Script response:', gasResult);
                
                if (gasResult.success && gasResult.data) {
                    await processLoadedData(gasResult.data, 'Google Apps Script');
                    return;
                }
            }
        } catch (gasError) {
            console.log('Google Apps Script method failed:', gasError.message);
        }
        
        // Method 2: Fallback to Google Sheets API
        console.log('Trying Google Sheets API as fallback...');
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/MPRData!A1:D10?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;
        
        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            throw new Error(`Sheets API failed: ${apiResponse.status} ${apiResponse.statusText}`);
        }
        
        const apiData = await apiResponse.json();
        console.log('Google Sheets API response:', apiData);
        
        if (apiData.values && apiData.values.length > 1) {
            // Look for data in row 2, column 2 (where the script saves it)
            const dataCell = apiData.values[1] && apiData.values[1][1];
            if (dataCell) {
                await processLoadedData(dataCell, 'Google Sheets API');
                return;
            }
        }
        
        // No data found
        console.log('No data found in Google Sheets');
        showToast('No existing data found - using defaults', 'warning');
        
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        showToast(`Failed to load data: ${error.message}`, 'error');
    }
}

// Helper function to process loaded data
async function processLoadedData(rawData, source) {
    try {
        let jsonString = rawData;
        
        // Handle MPR_DATA prefix
        if (typeof rawData === 'string' && rawData.startsWith('MPR_DATA{')) {
            jsonString = rawData.substring(8); // Remove "MPR_DATA" prefix
            console.log('Removed MPR_DATA prefix');
        }
        
        // Parse JSON
        const jsonData = JSON.parse(jsonString);
        console.log('Parsed JSON data:', jsonData);
        
        // Convert date strings back to Date objects
        convertDatesInObject(jsonData);
        
        // Merge data
        let updatedCount = 0;
        
        if (jsonData.weeklyReports) {
            appData.weeklyReports = mergeWeeklyReports(appData.weeklyReports, jsonData.weeklyReports);
            updatedCount++;
        }
        
        if (jsonData.teamMembers && Array.isArray(jsonData.teamMembers)) {
            appData.teamMembers = mergeTeamMembers(appData.teamMembers, jsonData.teamMembers);
            updatedCount++;
        }
        
        if (jsonData.adminCredentials) {
            appData.adminCredentials = { ...appData.adminCredentials, ...jsonData.adminCredentials };
            updatedCount++;
        }
        
        // Count reports for user feedback
        const reportCount = countSubmittedReports(appData.weeklyReports);
        
        console.log('Data successfully loaded and merged');
        showToast(`Data loaded via ${source}! Found ${reportCount} submitted reports.`, 'success');
        
        // Update UI if logged in   
        if (isAdminLoggedIn) {
            renderMonths();
            updateStats();
        }
        
    } catch (parseError) {
        console.error('Error processing loaded data:', parseError);
        showToast('Data found but could not be parsed', 'error');
    }
}

// Helper function to merge weekly reports
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

// Helper function to merge team members
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

// Helper function to convert date strings
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

// Helper function to count submitted reports
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

// Enhanced save function
async function saveDataToSheets() {
    try {
        console.log('Starting save to Google Sheets...');
        showToast('Saving data...', 'info');
        
        // Prepare data
        const dataToSave = JSON.stringify(appData, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        });
        
        // Add MPR_DATA prefix for consistency
        const prefixedData = 'MPR_DATA' + dataToSave;
        
        console.log('Data size:', prefixedData.length, 'characters');
        
        // Prepare form data
        const formData = new FormData();
        formData.append('spreadsheetId', GOOGLE_SHEETS_CONFIG.spreadsheetId);
        formData.append('data', prefixedData);
        formData.append('timestamp', new Date().toISOString());
        formData.append('action', 'save');
        
        // Send to Google Apps Script
        const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.text();
        console.log('Save response:', result);
        
        if (result.includes('SUCCESS')) {
            showToast('Data saved successfully!', 'success');
        } else if (result.includes('ERROR')) {
            throw new Error(result.replace('ERROR: ', ''));
        } else {
            console.warn('Unexpected response:', result);
            showToast('Save completed with unexpected response', 'warning');
        }
        
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        showToast(`Save failed: ${error.message}`, 'error');
        
        // Create local backup as fallback
        downloadBackup();
        showToast('Local backup created as fallback', 'info');
    }
}

// Enhanced admin login with better data loading
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
        
        // Test connection and load data
        showToast('Testing connection and loading data...', 'info');
        
        try {
            // Test if Google Sheets is accessible
            await testGoogleSheetsConnection();
            
            // Load existing data
            await loadDataFromSheets();
            
        } catch (error) {
            console.error('Error during login data loading:', error);
            showToast('Login successful, but data loading failed', 'warning');
        }
        
        // Show intro and update UI
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

// Enhanced connection test
async function testGoogleSheetsConnection() {
    try {
        console.log('Testing Google Sheets connection...');
        
        // Test Google Apps Script
        const gasResponse = await fetch(`${GOOGLE_SHEETS_CONFIG.webAppUrl}?spreadsheetId=${GOOGLE_SHEETS_CONFIG.spreadsheetId}&action=test`);
        
        if (gasResponse.ok) {
            console.log('Google Apps Script connection: OK');
            showToast('Connection successful!', 'success');
            return true;
        }
        
        // Fallback test with Sheets API
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.spreadsheetId}?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;
        const apiResponse = await fetch(apiUrl);
        
        if (apiResponse.ok) {
            console.log('Google Sheets API connection: OK');
            showToast('Fallback connection successful!', 'success');
            return true;
        }
        
        throw new Error('Both connection methods failed');
        
    } catch (error) {
        console.error('Connection test failed:', error);
        showToast(`Connection failed: ${error.message}`, 'error');
        return false;
    }
}

// Enhanced toast function with info type
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
    
    currentToast = setTimeout(function() {
        toast.classList.remove('show');
        currentToast = null;
    }, 4000);
}
