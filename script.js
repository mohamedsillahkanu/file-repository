// Global variables
var isAdminLoggedIn = false;
var currentUser = null;
var currentMonth = null;
var currentWeek = null;
var currentToast = null;

// Google Sheets configuration
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'AIzaSyBSxmmqw67fC349cpfVJ6ZltHo3wmdcGgE',
    spreadsheetId: '1jqf7JFYbtaQxWla3TdYqLnpcnPmAbDIYOvn8PruO13M',
    range: 'MPRData!A1:B1'
};

// Data will be loaded from Google Sheets
var appData = {
    weeklyReports: {},
    adminCredentials: {
        'admin': 'mpr2025'
    },
    teamMembers: [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            role: 'Pharmacy Lead',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
            pin: '1234'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            role: 'Hospital/PHU OPD Coordinator',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
            pin: '5678'
        },
        {
            id: 3,
            name: 'Nurse Jane Smith',
            role: 'In-patient Ward Supervisor',
            avatar: 'https://images.unsplash.com/photo-1594824501085-4b1d66fc31fa?w=150&h=150&fit=crop&crop=face',
            pin: '9012'
        },
        {
            id: 4,
            name: 'Dr. Robert Williams',
            role: 'Hospital Laboratory Manager',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
            pin: '3456'
        },
        {
            id: 5,
            name: 'Dr. Emily Davis',
            role: 'DHMT Coordinator',
            avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face',
            pin: '7890'
        },
        {
            id: 6,
            name: 'James Rodriguez',
            role: 'CHW Program Manager',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            pin: '2468'
        },
        {
            id: 7,
            name: 'Dr. Maria Garcia',
            role: 'ANC Specialist',
            avatar: 'https://images.unsplash.com/photo-1594824501084-9be42d1b2ae8?w=150&h=150&fit=crop&crop=face',
            pin: '1357'
        },
        {
            id: 8,
            name: 'David Thompson',
            role: 'Community Engagement Lead',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            pin: '9753'
        }
    ]
};

// Month data for 2025 with weekly breakdown
var MONTHS_2025 = [
    { 
        number: 1, 
        name: 'January', 
        dueDate: '2025-01-31T23:59:59', 
        days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-01-01', endDate: '2025-01-07', dueDate: '2025-01-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-01-08', endDate: '2025-01-14', dueDate: '2025-01-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-01-15', endDate: '2025-01-21', dueDate: '2025-01-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-01-22', endDate: '2025-01-31', dueDate: '2025-02-01T23:59:59' }
        ]
    },
    { 
        number: 2, 
        name: 'February', 
        dueDate: '2025-02-28T23:59:59', 
        days: 28,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-02-01', endDate: '2025-02-07', dueDate: '2025-02-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-02-08', endDate: '2025-02-14', dueDate: '2025-02-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-02-15', endDate: '2025-02-21', dueDate: '2025-02-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-02-22', endDate: '2025-02-28', dueDate: '2025-03-01T23:59:59' }
        ]
    },
    { 
        number: 3, 
        name: 'March', 
        dueDate: '2025-03-31T23:59:59', 
        days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-03-01', endDate: '2025-03-07', dueDate: '2025-03-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-03-08', endDate: '2025-03-14', dueDate: '2025-03-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-03-15', endDate: '2025-03-21', dueDate: '2025-03-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-03-22', endDate: '2025-03-31', dueDate: '2025-04-01T23:59:59' }
        ]
    },
    { 
        number: 4, 
        name: 'April', 
        dueDate: '2025-04-30T23:59:59', 
        days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-04-01', endDate: '2025-04-07', dueDate: '2025-04-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-04-08', endDate: '2025-04-14', dueDate: '2025-04-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-04-15', endDate: '2025-04-21', dueDate: '2025-04-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-04-22', endDate: '2025-04-30', dueDate: '2025-05-01T23:59:59' }
        ]
    },
    { 
        number: 5, 
        name: 'May', 
        dueDate: '2025-05-31T23:59:59', 
        days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-05-01', endDate: '2025-05-07', dueDate: '2025-05-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-05-08', endDate: '2025-05-14', dueDate: '2025-05-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-05-15', endDate: '2025-05-21', dueDate: '2025-05-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-05-22', endDate: '2025-05-31', dueDate: '2025-06-01T23:59:59' }
        ]
    },
    { 
        number: 6, 
        name: 'June', 
        dueDate: '2025-06-30T23:59:59', 
        days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-06-01', endDate: '2025-06-07', dueDate: '2025-06-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-06-08', endDate: '2025-06-14', dueDate: '2025-06-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-06-15', endDate: '2025-06-21', dueDate: '2025-06-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-06-22', endDate: '2025-06-30', dueDate: '2025-07-01T23:59:59' }
        ]
    },
    { 
        number: 7, 
        name: 'July', 
        dueDate: '2025-07-31T23:59:59', 
        days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-07-01', endDate: '2025-07-07', dueDate: '2025-07-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-07-08', endDate: '2025-07-14', dueDate: '2025-07-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-07-15', endDate: '2025-07-21', dueDate: '2025-07-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-07-22', endDate: '2025-07-31', dueDate: '2025-08-01T23:59:59' }
        ]
    },
    { 
        number: 8, 
        name: 'August', 
        dueDate: '2025-08-31T23:59:59', 
        days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-08-01', endDate: '2025-08-07', dueDate: '2025-08-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-08-08', endDate: '2025-08-14', dueDate: '2025-08-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-08-15', endDate: '2025-08-21', dueDate: '2025-08-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-08-22', endDate: '2025-08-31', dueDate: '2025-09-01T23:59:59' }
        ]
    },
    { 
        number: 9, 
        name: 'September', 
        dueDate: '2025-09-30T23:59:59', 
        days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-09-01', endDate: '2025-09-07', dueDate: '2025-09-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-09-08', endDate: '2025-09-14', dueDate: '2025-09-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-09-15', endDate: '2025-09-21', dueDate: '2025-09-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-09-22', endDate: '2025-09-30', dueDate: '2025-10-01T23:59:59' }
        ]
    },
    { 
        number: 10, 
        name: 'October', 
        dueDate: '2025-10-31T23:59:59', 
        days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-10-01', endDate: '2025-10-07', dueDate: '2025-10-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-10-08', endDate: '2025-10-14', dueDate: '2025-10-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-10-15', endDate: '2025-10-21', dueDate: '2025-10-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-10-22', endDate: '2025-10-31', dueDate: '2025-11-01T23:59:59' }
        ]
    },
    { 
        number: 11, 
        name: 'November', 
        dueDate: '2025-11-30T23:59:59', 
        days: 30,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-11-01', endDate: '2025-11-07', dueDate: '2025-11-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-11-08', endDate: '2025-11-14', dueDate: '2025-11-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-11-15', endDate: '2025-11-21', dueDate: '2025-11-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-11-22', endDate: '2025-11-30', dueDate: '2025-12-01T23:59:59' }
        ]
    },
    { 
        number: 12, 
        name: 'December', 
        dueDate: '2025-12-31T23:59:59', 
        days: 31,
        weeks: [
            { number: 1, name: 'Week 1', startDate: '2025-12-01', endDate: '2025-12-07', dueDate: '2025-12-08T23:59:59' },
            { number: 2, name: 'Week 2', startDate: '2025-12-08', endDate: '2025-12-14', dueDate: '2025-12-15T23:59:59' },
            { number: 3, name: 'Week 3', startDate: '2025-12-15', endDate: '2025-12-21', dueDate: '2025-12-22T23:59:59' },
            { number: 4, name: 'Week 4', startDate: '2025-12-22', endDate: '2025-12-31', dueDate: '2026-01-01T23:59:59' }
        ]
    }
];

// Google Sheets API functions
async function loadDataFromSheets() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/MPRData!A1:C1?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            console.log('No existing data in Google Sheets, using defaults');
            return;
        }
        
        const data = await response.json();
        if (data.values && data.values.length > 0 && data.values[0].length > 1) {
            // The data is stored in column B (index 1)
            const jsonData = JSON.parse(data.values[0][1]);
            
            // Convert date strings back to Date objects
            function convertDates(obj) {
                if (obj && typeof obj === 'object') {
                    for (let key in obj) {
                        if (key === 'submittedDate' && typeof obj[key] === 'string') {
                            obj[key] = new Date(obj[key]);
                        } else if (typeof obj[key] === 'object') {
                            convertDates(obj[key]);
                        }
                    }
                }
            }
            
            convertDates(jsonData);
            
            // Merge loaded data with default structure
            if (jsonData.weeklyReports) {
                appData.weeklyReports = jsonData.weeklyReports;
            }
            if (jsonData.teamMembers) {
                appData.teamMembers = jsonData.teamMembers;
            }
            if (jsonData.adminCredentials) {
                appData.adminCredentials = jsonData.adminCredentials;
            }
            
            console.log('Data loaded from Google Sheets successfully:', appData);
            showToast('Data loaded from Google Sheets successfully!');
        }
    } catch (error) {
        console.log('Error loading from Google Sheets:', error);
        showToast('Using default data - Google Sheets unavailable', 'warning');
    }
}

async function saveDataToSheets() {
    try {
        // Prepare data for Google Sheets
        const dataToSave = JSON.stringify(appData, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        });
        
        // Use Google Apps Script Web App as proxy for writing data
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbzZ-dlOG7mNW3-ToxmByuJDajekGm5xsYJ_ISKNtK10ETi9vhtsPShCfz1siZN4AELJ6g/exec';
        
        const formData = new FormData();
        formData.append('spreadsheetId', GOOGLE_SHEETS_CONFIG.spreadsheetId);
        formData.append('data', dataToSave);
        formData.append('timestamp', new Date().toISOString());
        
        const response = await fetch(webAppUrl, {
            method: 'POST',
            body: formData
        });
        
        showToast('Data saved to Google Sheets successfully!');
        console.log('Data sent to Google Sheets');
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        showToast('Error saving to Google Sheets: ' + error.message, 'error');
    }
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
        a.download = 'mpr-backup-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Backup downloaded as fallback');
    } catch (error) {
        console.error('Error creating backup:', error);
        showToast('Error creating backup: ' + error.message, 'error');
    }
}

// Utility functions
function getCurrentMonth() {
    var now = new Date();
    return now.getMonth() + 1;
}

function getCurrentWeek() {
    var now = new Date();
    var currentMonthNum = getCurrentMonth();
    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === currentMonthNum) {
            month = MONTHS_2025[i];
            break;
        }
    }
    
    if (!month) return 1;
    
    for (var j = 0; j < month.weeks.length; j++) {
        var week = month.weeks[j];
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
    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === monthNumber) {
            month = MONTHS_2025[i];
            break;
        }
    }
    var week = null;
    for (var j = 0; j < month.weeks.length; j++) {
        if (month.weeks[j].number === weekNumber) {
            week = month.weeks[j];
            break;
        }
    }
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

// Modal functions
function showPinModal(userId) {
    var user = null;
    for (var i = 0; i < appData.teamMembers.length; i++) {
        if (appData.teamMembers[i].id === userId) {
            user = appData.teamMembers[i];
            break;
        }
    }
    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === currentMonth) {
            month = MONTHS_2025[i];
            break;
        }
    }
    var week = null;
    if (month) {
        for (var j = 0; j < month.weeks.length; j++) {
            if (month.weeks[j].number === currentWeek) {
                week = month.weeks[j];
                break;
            }
        }
    }
    if (!user || !week) return;

    var status = getUserStatus(userId, currentMonth, currentWeek);
    if (status === 'overdue' && !getUserReport(userId, currentMonth, currentWeek)) {
        showToast('The deadline has passed. You can no longer submit reports.', 'error');
        return;
    }

    currentUser = user;
    document.getElementById('pinUserName').textContent = 'Hello ' + user.name + ', please enter your 4-digit PIN to submit your ' + month.name + ' 2025 ' + week.name + ' report';
    document.getElementById('pinModal').style.display = 'flex';
    setTimeout(function() {
        document.getElementById('userPin').focus();
    }, 100);
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

    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === currentMonth) {
            month = MONTHS_2025[i];
            break;
        }
    }
    var week = null;
    if (month) {
        for (var j = 0; j < month.weeks.length; j++) {
            if (month.weeks[j].number === currentWeek) {
                week = month.weeks[j];
                break;
            }
        }
    }
    var existingReport = getUserReport(currentUser.id, currentMonth, currentWeek);

    document.getElementById('reportUserName').textContent = currentUser.name + ' - ' + month.name + ' 2025 ' + week.name + ' Report';
    
    // Pre-fill existing data if available
    if (existingReport) {
        document.getElementById('activitiesCompleted').value = existingReport.activitiesCompleted || '';
        document.getElementById('keyAchievements').value = existingReport.keyAchievements || '';
        document.getElementById('challengesFaced').value = existingReport.challengesFaced || '';
        document.getElementById('lessonsLearned').value = existingReport.lessonsLearned || '';
        document.getElementById('nextWeekPlans').value = existingReport.nextWeekPlans || '';
        document.getElementById('supportNeeded').value = existingReport.supportNeeded || '';
        document.getElementById('additionalComments').value = existingReport.additionalComments || '';
    } else {
        // Clear form
        document.getElementById('activitiesCompleted').value = '';
        document.getElementById('keyAchievements').value = '';
        document.getElementById('challengesFaced').value = '';
        document.getElementById('lessonsLearned').value = '';
        document.getElementById('nextWeekPlans').value = '';
        document.getElementById('supportNeeded').value = '';
        document.getElementById('additionalComments').value = '';
    }
    
    document.getElementById('reportModal').style.display = 'flex';
    setTimeout(function() {
        document.getElementById('activitiesCompleted').focus();
    }, 100);
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
    document.getElementById('reportErrorMessage').style.display = 'none';
}

async function submitReport() {
    var activitiesCompleted = document.getElementById('activitiesCompleted').value.trim();
    var keyAchievements = document.getElementById('keyAchievements').value.trim();
    var challengesFaced = document.getElementById('challengesFaced').value.trim();
    var lessonsLearned = document.getElementById('lessonsLearned').value.trim();
    var nextWeekPlans = document.getElementById('nextWeekPlans').value.trim();
    var supportNeeded = document.getElementById('supportNeeded').value.trim();
    var additionalComments = document.getElementById('additionalComments').value.trim();
    var errorMessage = document.getElementById('reportErrorMessage');
    
    errorMessage.style.display = 'none';

    if (!activitiesCompleted || !keyAchievements || !nextWeekPlans) {
        errorMessage.textContent = 'Please fill in all required fields (Activities, Achievements, and Next Week Plans).';
        errorMessage.style.display = 'block';
        return;
    }

    if (currentUser && currentMonth && currentWeek) {
        var month = null;
        for (var i = 0; i < MONTHS_2025.length; i++) {
            if (MONTHS_2025[i].number === currentMonth) {
                month = MONTHS_2025[i];
                break;
            }
        }
        var week = null;
        if (month) {
            for (var j = 0; j < month.weeks.length; j++) {
                if (month.weeks[j].number === currentWeek) {
                    week = month.weeks[j];
                    break;
                }
            }
        }
        
        var report = {
            submitted: true,
            submittedDate: new Date(),
            activitiesCompleted: activitiesCompleted,
            keyAchievements: keyAchievements,
            challengesFaced: challengesFaced,
            lessonsLearned: lessonsLearned,
            nextWeekPlans: nextWeekPlans,
            supportNeeded: supportNeeded,
            additionalComments: additionalComments
        };

        console.log('Saving report for user:', currentUser.name, 'Month:', currentMonth, 'Week:', currentWeek);
        setUserReport(currentUser.id, currentMonth, currentWeek, report);
        
        console.log('Current appData after saving:', appData);

        // Save data to Google Sheets automatically
        try {
            await saveDataToSheets();
            console.log('Successfully saved to Google Sheets');
        } catch (error) {
            console.error('Failed to save to Google Sheets:', error);
            showToast('Failed to save to Google Sheets: ' + error.message, 'error');
        }

        closeReportModal();
        renderUsersGrid();
        renderWeeksGrid();
        renderMonths();
        updateStats();
        showToast(month.name + ' 2025 ' + week.name + ' report submitted successfully for ' + currentUser.name + '!');
    }
}

function showUserSummary(userId) {
    var user = null;
    for (var i = 0; i < appData.teamMembers.length; i++) {
        if (appData.teamMembers[i].id === userId) {
            user = appData.teamMembers[i];
            break;
        }
    }
    if (!user) return;

    document.getElementById('summaryUserName').textContent = user.name + ' - Complete Report History';
    
    // Collect all reports for this user across all months and weeks
    var userReports = [];
    for (var m = 0; m < MONTHS_2025.length; m++) {
        var month = MONTHS_2025[m];
        for (var w = 0; w < month.weeks.length; w++) {
            var week = month.weeks[w];
            var report = getUserReport(userId, month.number, week.number);
            if (report && report.submitted) {
                userReports.push({
                    month: month,
                    week: week,
                    report: report
                });
            }
        }
    }

    // Generate summary content
    var summaryHtml = '';

    if (userReports.length === 0) {
        summaryHtml = '<div class="no-reports-message"><h3>No Reports Submitted Yet</h3><p>' + user.name + ' hasn\'t submitted any weekly reports yet.</p></div>';
    } else {
        var totalPossibleReports = 12 * 4; // 12 months × 4 weeks
        
        // Add statistics
        summaryHtml += '<div class="summary-stats">';
        summaryHtml += '<div class="summary-stat"><span class="summary-stat-number">' + userReports.length + '</span><span class="summary-stat-label">Reports Submitted</span></div>';
        summaryHtml += '<div class="summary-stat"><span class="summary-stat-number">' + (totalPossibleReports - userReports.length) + '</span><span class="summary-stat-label">Pending</span></div>';
        summaryHtml += '<div class="summary-stat"><span class="summary-stat-number">' + Math.round((userReports.length / totalPossibleReports) * 100) + '%</span><span class="summary-stat-label">Completion Rate</span></div>';
        summaryHtml += '</div>';

        // Add individual reports
        for (var r = 0; r < userReports.length; r++) {
            var reportData = userReports[r];
            var startDate = new Date(reportData.week.startDate).toLocaleDateString();
            var endDate = new Date(reportData.week.endDate).toLocaleDateString();
            var submittedDate = reportData.report.submittedDate;
            if (typeof submittedDate === 'string') {
                submittedDate = new Date(submittedDate);
            }
            
            summaryHtml += '<div class="report-summary-card">';
            summaryHtml += '<div class="report-month-header">';
            summaryHtml += '<div class="report-month-title">' + reportData.month.name + ' 2025 - ' + reportData.week.name + '</div>';
            summaryHtml += '<div class="report-date">Period: ' + startDate + ' - ' + endDate + '<br>Submitted: ' + submittedDate.toLocaleDateString() + '</div>';
            summaryHtml += '</div>';
            
            summaryHtml += '<div class="report-section"><div class="report-section-title">Activities Completed</div><div class="report-section-content">' + reportData.report.activitiesCompleted + '</div></div>';
            summaryHtml += '<div class="report-section"><div class="report-section-title">Key Achievements</div><div class="report-section-content">' + reportData.report.keyAchievements + '</div></div>';
            
            if (reportData.report.challengesFaced) {
                summaryHtml += '<div class="report-section"><div class="report-section-title">Challenges Faced</div><div class="report-section-content">' + reportData.report.challengesFaced + '</div></div>';
            }
            
            if (reportData.report.lessonsLearned) {
                summaryHtml += '<div class="report-section"><div class="report-section-title">Lessons Learned</div><div class="report-section-content">' + reportData.report.lessonsLearned + '</div></div>';
            }
            
            summaryHtml += '<div class="report-section"><div class="report-section-title">Next Week Plans</div><div class="report-section-content">' + reportData.report.nextWeekPlans + '</div></div>';
            
            if (reportData.report.supportNeeded) {
                summaryHtml += '<div class="report-section"><div class="report-section-title">Support Needed</div><div class="report-section-content">' + reportData.report.supportNeeded + '</div></div>';
            }
            
            if (reportData.report.additionalComments) {
                summaryHtml += '<div class="report-section"><div class="report-section-title">Additional Comments</div><div class="report-section-content">' + reportData.report.additionalComments + '</div></div>';
            }
            
            summaryHtml += '</div>';
        }
    }

    document.getElementById('summaryContent').innerHTML = summaryHtml;
    document.getElementById('summaryModal').style.display = 'flex';
}

function closeSummaryModal() {
    document.getElementById('summaryModal').style.display = 'none';
}

function viewUserReport(userId) {
    var user = null;
    for (var i = 0; i < appData.teamMembers.length; i++) {
        if (appData.teamMembers[i].id === userId) {
            user = appData.teamMembers[i];
            break;
        }
    }
    var report = getUserReport(userId, currentMonth, currentWeek);
    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === currentMonth) {
            month = MONTHS_2025[i];
            break;
        }
    }
    var week = null;
    if (month) {
        for (var j = 0; j < month.weeks.length; j++) {
            if (month.weeks[j].number === currentWeek) {
                week = month.weeks[j];
                break;
            }
        }
    }
    
    if (!user || !report || !report.submitted) return;

    var startDate = new Date(week.startDate).toLocaleDateString();
    var endDate = new Date(week.endDate).toLocaleDateString();
    var submittedDate = report.submittedDate;
    if (typeof submittedDate === 'string') {
        submittedDate = new Date(submittedDate);
    }

    var reportDetails = month.name + ' 2025 - ' + week.name + ' Report\n\n';
    reportDetails += 'Name: ' + user.name + '\n';
    reportDetails += 'Role: ' + user.role + '\n';
    reportDetails += 'Week Period: ' + startDate + ' - ' + endDate + '\n';
    reportDetails += 'Submitted: ' + submittedDate.toLocaleString() + '\n\n';
    
    reportDetails += 'ACTIVITIES COMPLETED:\n' + report.activitiesCompleted + '\n\n';
    reportDetails += 'KEY ACHIEVEMENTS:\n' + report.keyAchievements + '\n\n';
    
    if (report.challengesFaced) {
        reportDetails += 'CHALLENGES FACED:\n' + report.challengesFaced + '\n\n';
    }
    
    if (report.lessonsLearned) {
        reportDetails += 'LESSONS LEARNED:\n' + report.lessonsLearned + '\n\n';
    }
    
    reportDetails += 'NEXT WEEK PLANS:\n' + report.nextWeekPlans + '\n\n';
    
    if (report.supportNeeded) {
        reportDetails += 'SUPPORT NEEDED:\n' + report.supportNeeded + '\n\n';
    }
    
    if (report.additionalComments) {
        reportDetails += 'ADDITIONAL COMMENTS:\n' + report.additionalComments + '\n';
    }

    alert(reportDetails);
}

// Rendering functions
function renderUsersGrid() {
    var grid = document.getElementById('usersGrid');
    grid.innerHTML = '';

    for (var i = 0; i < appData.teamMembers.length; i++) {
        var user = appData.teamMembers[i];
        var status = getUserStatus(user.id, currentMonth, currentWeek);
        var report = getUserReport(user.id, currentMonth, currentWeek);
        
        var card = document.createElement('div');
        card.className = 'user-card ' + status;
        
        var statusBadge = '';
        var actionButtons = '';

        switch (status) {
            case 'submitted':
                statusBadge = '<span class="user-status status-submitted">✅ Submitted</span>';
                actionButtons = '<button class="btn btn-secondary" onclick="viewUserReport(' + user.id + ')">👁️ View Report</button><button class="btn btn-secondary" onclick="showUserSummary(' + user.id + ')">📊 View Summary</button>';
                break;
            case 'overdue':
                statusBadge = '<span class="user-status status-overdue">⚠️ Overdue</span>';
                actionButtons = '<button class="btn btn-warning" disabled>🔒 Deadline Passed</button><button class="btn btn-secondary" onclick="showUserSummary(' + user.id + ')">📊 View Summary</button>';
                break;
            default:
                statusBadge = '<span class="user-status status-pending">⏳ Pending</span>';
                actionButtons = '<button class="btn btn-primary" onclick="showPinModal(' + user.id + ')">📝 Fill Report</button><button class="btn btn-secondary" onclick="showUserSummary(' + user.id + ')">📊 View Summary</button>';
        }

        card.innerHTML = '<div class="user-header"><img src="' + user.avatar + '" alt="' + user.name + '" class="user-avatar"><div class="user-info"><div class="user-name">' + user.name + '</div><div class="user-role">' + user.role + '</div>' + statusBadge + '</div></div><div class="user-actions">' + actionButtons + '</div>';

        grid.appendChild(card);
    }
}

function renderWeeksGrid() {
    var grid = document.getElementById('weeksGrid');
    grid.innerHTML = '';

    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === currentMonth) {
            month = MONTHS_2025[i];
            break;
        }
    }
    if (!month) return;

    for (var w = 0; w < month.weeks.length; w++) {
        var week = month.weeks[w];
        var status = getWeekStatus(week);
        var startDate = new Date(week.startDate);
        var endDate = new Date(week.endDate);
        var dueDate = new Date(week.dueDate);
        
        // Count reports for this week
        var weekReports = (appData.weeklyReports[currentMonth] && appData.weeklyReports[currentMonth][week.number]) ? appData.weeklyReports[currentMonth][week.number] : {};
        var submittedCount = 0;
        for (var key in weekReports) {
            if (weekReports[key] && weekReports[key].submitted) {
                submittedCount++;
            }
        }
        
        var card = document.createElement('div');
        card.className = 'week-card ' + status;
        card.onclick = function(weekNum) {
            return function() { openWeekModal(weekNum); };
        }(week.number);
        
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

        card.innerHTML = '<div class="week-header"><div class="week-info"><div class="week-name">' + week.name + '</div><div class="week-period">' + startDate.toLocaleDateString() + ' - ' + endDate.toLocaleDateString() + '</div></div><div class="week-due-date"><span class="week-due-label">Due Date</span><div class="week-due-value ' + dueDateClass + '">' + dueDate.toLocaleDateString() + '</div></div></div><div class="week-status-badge ' + statusColor + '">' + statusBadge + '</div><div class="week-summary"><div class="week-summary-item"><span class="week-summary-number">' + submittedCount + '</span><span class="week-summary-label">Submitted</span></div><div class="week-summary-item"><span class="week-summary-number">' + appData.teamMembers.length + '</span><span class="week-summary-label">Total Users</span></div><div class="week-summary-item"><span class="week-summary-number">' + Math.round((submittedCount / appData.teamMembers.length) * 100) + '%</span><span class="week-summary-label">Complete</span></div></div><div style="text-align: center; color: #8b949e; font-size: 12px; font-style: italic; margin-top: 10px;">👆 Click to manage reports</div>';

        grid.appendChild(card);
    }
}

function renderMonths() {
    var grid = document.getElementById('monthsGrid');
    grid.innerHTML = '';

    for (var m = 0; m < MONTHS_2025.length; m++) {
        var month = MONTHS_2025[m];
        // Count reports for this month across all weeks
        var monthSubmittedCount = 0;
        var totalPossibleReports = appData.teamMembers.length * 4; // 4 weeks per month
        
        for (var w = 0; w < month.weeks.length; w++) {
            var week = month.weeks[w];
            var weekReports = (appData.weeklyReports[month.number] && appData.weeklyReports[month.number][week.number]) ? appData.weeklyReports[month.number][week.number] : {};
            for (var key in weekReports) {
                if (weekReports[key] && weekReports[key].submitted) {
                    monthSubmittedCount++;
                }
            }
        }
        
        var card = document.createElement('div');
        card.className = 'month-card';
        card.onclick = function(monthNum) {
            return function() { openMonthModal(monthNum); };
        }(month.number);
        
        // Determine overall month status based on current date
        var now = new Date();
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

        card.innerHTML = '<div class="month-header"><div class="month-info"><div class="month-name">' + month.name + '</div><div class="month-year">2025</div></div><div class="due-date-info"><span class="due-date-label">4 Weeks</span><div class="due-date">' + month.weeks.length + ' weeks</div></div></div><div class="month-status"><span class="status-badge ' + statusColor + '">' + monthStatus + '</span></div><div class="reports-summary"><div class="summary-item"><span class="summary-number">' + monthSubmittedCount + '</span><span class="summary-label">Submitted</span></div><div class="summary-item"><span class="summary-number">' + totalPossibleReports + '</span><span class="summary-label">Total Reports</span></div><div class="summary-item"><span class="summary-number">' + Math.round((monthSubmittedCount / totalPossibleReports) * 100) + '%</span><span class="summary-label">Complete</span></div></div><div class="click-hint">👆 Click to manage weekly reports</div>';

        grid.appendChild(card);
    }
}

function updateStats() {
    var totalReports = 0;
    for (var month in appData.weeklyReports) {
        for (var week in appData.weeklyReports[month]) {
            for (var user in appData.weeklyReports[month][week]) {
                if (appData.weeklyReports[month][week][user] && appData.weeklyReports[month][week][user].submitted) {
                    totalReports++;
                }
            }
        }
    }

    var currentMonthNum = getCurrentMonth();
    var currentMonthName = 'Unknown';
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === currentMonthNum) {
            currentMonthName = MONTHS_2025[i].name;
            break;
        }
    }
    
    document.getElementById('totalReports').textContent = totalReports;
    document.getElementById('currentMonth').textContent = currentMonthName + ' 2025';
}

function openMonthModal(monthNumber) {
    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === monthNumber) {
            month = MONTHS_2025[i];
            break;
        }
    }
    if (!month) return;

    currentMonth = monthNumber;
    document.getElementById('weeksModalTitle').textContent = month.name + ' 2025 - Weekly Reports';
    document.getElementById('weeksModalSubtitle').textContent = 'Select a week to manage team reports';

    renderWeeksGrid();
    document.getElementById('weeksModal').style.display = 'flex';
}

function closeWeeksModal() {
    document.getElementById('weeksModal').style.display = 'none';
    currentMonth = null;
}

function openWeekModal(weekNumber) {
    var month = null;
    for (var i = 0; i < MONTHS_2025.length; i++) {
        if (MONTHS_2025[i].number === currentMonth) {
            month = MONTHS_2025[i];
            break;
        }
    }
    var week = null;
    if (month) {
        for (var j = 0; j < month.weeks.length; j++) {
            if (month.weeks[j].number === weekNumber) {
                week = month.weeks[j];
                break;
            }
        }
    }
    if (!week) return;

    currentWeek = weekNumber;
    document.getElementById('usersModalTitle').textContent = month.name + ' 2025 - ' + week.name + ' - Team Reports';
    
    var status = getWeekStatus(week);
    var startDate = new Date(week.startDate).toLocaleDateString();
    var endDate = new Date(week.endDate).toLocaleDateString();
    var dueDate = new Date(week.dueDate).toLocaleDateString();
    
    if (status === 'overdue') {
        document.getElementById('usersModalSubtitle').textContent = 'Deadline passed (' + dueDate + ') - View submitted reports only';
    } else {
        document.getElementById('usersModalSubtitle').textContent = 'Week Period: ' + startDate + ' - ' + endDate + ' | Due: ' + dueDate + ' - Click on a team member to submit their weekly report';
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
    setTimeout(function() {
        document.getElementById('adminUsername').focus();
    }, 100);
}

function hideAdminLoginModal() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

async function adminLogin() {
    var user = document.getElementById('adminUsername').value.trim();
    var pass = document.getElementById('adminPassword').value;
    var errorMessage = document.getElementById('adminErrorMessage');
    
    errorMessage.style.display = 'none';

    if (!user || !pass) {
        errorMessage.textContent = 'Please enter both username and password.';
        errorMessage.style.display = 'block';
        return;
    }

    if (appData.adminCredentials[user] && appData.adminCredentials[user] === pass) {
        isAdminLoggedIn = true;
        hideAdminLoginModal();
        
        // Load existing data from Google Sheets
        await loadDataFromSheets();
        
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
    
    setTimeout(function() {
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

    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    if (type === 'error') {
        toast.className += ' error';
    } else if (type === 'warning') {
        toast.className += ' warning';
    }
    toast.classList.add('show');
    
    currentToast = setTimeout(function() {
        toast.classList.remove('show');
        currentToast = null;
    }, 4000);
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    var adminUsernameInput = document.getElementById('adminUsername');
    var adminPasswordInput = document.getElementById('adminPassword');
    var pinInput = document.getElementById('userPin');
    
    // Admin login form events
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

    // PIN form events
    if (pinInput) {
        pinInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyPin();
            }
        });

        // Only allow numbers in PIN input
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

    // Show admin login modal initially
    if (!isAdminLoggedIn) {
        showAdminLoginModal();
    }
});
