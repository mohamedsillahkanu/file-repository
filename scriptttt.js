// Application state
let isLoggedIn = false;
let currentUser = '';
let selectedCategory = null;

// Valid credentials for demo
const validCredentials = {
    'admin': 'password123',
    'researcher': 'data2024',
    'analyst': 'epi_secure'
};

// Data categories with sample data
const dataCategories = {
    'shapefiles': { 
        name: 'Shapefiles', 
        files: [
            {
                name: 'district_boundaries.shp',
                size: '2.3 MB',
                type: 'shapefile',
                icon: '🗺️',
                path: '/data/shapefiles/district_boundaries.shp',
                content: 'ESRI Shapefile containing administrative boundary polygons for all districts. Includes attributes: DISTRICT_ID, DISTRICT_NAME, AREA_KM2, POPULATION_2021, and geographic coordinates in WGS84 projection.'
            },
            {
                name: 'health_facilities.shp',
                size: '856 KB',
                type: 'shapefile',
                icon: '🗺️',
                path: '/data/shapefiles/health_facilities.shp',
                content: 'Point shapefile of health facility locations including hospitals, clinics, and health posts. Contains facility type, capacity, coordinates, and operational status data.'
            },
            {
                name: 'chiefdom_boundaries.shp',
                size: '4.1 MB',
                type: 'shapefile',
                icon: '🗺️',
                path: '/data/shapefiles/chiefdom_boundaries.shp',
                content: 'Detailed chiefdom boundary polygons with demographic and administrative data. Includes population density, area measurements, and hierarchical administrative codes.'
            }
        ]
    },
    'epi_routine': { 
        name: 'Epi Routine Data', 
        files: [
            {
                name: 'weekly_surveillance_2024.csv',
                size: '3.2 MB',
                type: 'csv',
                icon: '📊',
                path: '/data/surveillance/weekly_surveillance_2024.csv',
                content: 'Weekly epidemiological surveillance data for 2024. Contains disease incidence, case counts, age groups, geographic distribution, and reporting completeness by health facility.'
            },
            {
                name: 'disease_outbreak_alerts.xlsx',
                size: '1.8 MB',
                type: 'excel',
                icon: '📊',
                path: '/data/surveillance/disease_outbreak_alerts.xlsx',
                content: 'Outbreak alert database with case investigations, laboratory confirmations, response measures, and epidemiological curves. Includes cholera, measles, and meningitis outbreaks.'
            },
            {
                name: 'mortality_surveillance.csv',
                size: '2.1 MB',
                type: 'csv',
                icon: '📊',
                path: '/data/surveillance/mortality_surveillance.csv',
                content: 'Mortality surveillance data with cause-specific death rates, age-stratified mortality, maternal and child death reviews, and facility-based death reporting.'
            }
        ]
    },
    'intervention': { 
        name: 'Intervention Data', 
        files: [
            {
                name: 'vaccination_campaigns_2023.xlsx',
                size: '2.7 MB',
                type: 'excel',
                icon: '💉',
                path: '/data/interventions/vaccination_campaigns_2023.xlsx',
                content: 'Mass vaccination campaign data including target populations, coverage rates, vaccine types, adverse events, and geographic distribution of immunization activities.'
            },
            {
                name: 'bed_net_distribution.csv',
                size: '1.4 MB',
                type: 'csv',
                icon: '🛏️',
                path: '/data/interventions/bed_net_distribution.csv',
                content: 'Insecticide-treated bed net distribution records with household registration, distribution dates, net types, and post-distribution monitoring surveys.'
            },
            {
                name: 'water_sanitation_projects.xlsx',
                size: '3.5 MB',
                type: 'excel',
                icon: '🚰',
                path: '/data/interventions/water_sanitation_projects.xlsx',
                content: 'WASH intervention tracking with water point construction, latrine coverage, hygiene education sessions, and community engagement metrics by district and chiefdom.'
            }
        ]
    },
    'campaign_survey': { 
        name: 'Campaign/Survey Data', 
        files: [
            {
                name: 'household_health_survey_2024.xlsx',
                size: '8.9 MB',
                type: 'excel',
                icon: '🏠',
                path: '/data/surveys/household_health_survey_2024.xlsx',
                content: 'Comprehensive household survey data with demographics, health seeking behavior, access to services, socioeconomic indicators, and health outcomes by geographic area.'
            },
            {
                name: 'knowledge_attitudes_practices.csv',
                size: '2.3 MB',
                type: 'csv',
                icon: '🧠',
                path: '/data/surveys/knowledge_attitudes_practices.csv',
                content: 'KAP survey results on disease prevention, treatment-seeking behavior, traditional medicine use, and health education effectiveness across different demographic groups.'
            },
            {
                name: 'facility_readiness_assessment.xlsx',
                size: '4.6 MB',
                type: 'excel',
                icon: '🏥',
                path: '/data/surveys/facility_readiness_assessment.xlsx',
                content: 'Health facility assessment data covering infrastructure, equipment availability, staff capacity, drug stock levels, and quality of care indicators.'
            }
        ]
    },
    'reports': { 
        name: 'Reports', 
        files: [
            {
                name: 'annual_epidemiological_report_2024.pdf',
                size: '12.4 MB',
                type: 'pdf',
                icon: '📄',
                path: '/data/reports/annual_epidemiological_report_2024.pdf',
                content: 'Comprehensive annual report analyzing disease trends, outbreak responses, surveillance system performance, and recommendations for public health action.'
            },
            {
                name: 'malaria_program_evaluation.docx',
                size: '5.7 MB',
                type: 'document',
                icon: '📋',
                path: '/data/reports/malaria_program_evaluation.docx',
                content: 'Detailed evaluation of national malaria control program including intervention effectiveness, cost analysis, and strategic recommendations for program improvement.'
            },
            {
                name: 'covid19_response_summary.pdf',
                size: '8.2 MB',
                type: 'pdf',
                icon: '📄',
                path: '/data/reports/covid19_response_summary.pdf',
                content: 'COVID-19 pandemic response analysis covering surveillance, case management, vaccination rollout, public health measures, and lessons learned.'
            }
        ]
    },
    'other': { name: 'Other Files', files: [...files] }
};

// DOM Elements
let elements = {};

// Initialize the application
function init() {
    // Cache DOM elements
    elements = {
        loginModal: document.getElementById('loginModal'),
        loginBtn: document.getElementById('loginBtn'),
        usernameInput: document.getElementById('usernameInput'),
        passwordInput: document.getElementById('passwordInput'),
        loginError: document.getElementById('loginError'),
        categoryDropdownBtn: document.getElementById('categoryDropdownBtn'),
        categoryDropdown: document.getElementById('categoryDropdown'),
        categoryDropdownArrow: document.getElementById('categoryDropdownArrow'),
        selectedCategory: document.getElementById('selectedCategory'),
        downloadSelectedBtn: document.getElementById('downloadSelectedBtn'),
        downloadAllBtn: document.getElementById('downloadAllBtn'),
        fileList: document.getElementById('fileList'),
        fileModal: document.getElementById('fileModal'),
        modalTitle: document.getElementById('modalTitle'),
        previewContent: document.getElementById('previewContent'),
        closeModal: document.getElementById('closeModal'),
        toast: document.getElementById('toast'),
        downloadProgress: document.getElementById('downloadProgress'),
        downloadIdle: document.getElementById('downloadIdle'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText')
    };

    // Set up event listeners
    setupEventListeners();

    // Check login status
    if (!isLoggedIn) {
        showLoginModal();
    } else {
        populateFileList();
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Login system
    elements.loginBtn.addEventListener('click', attemptLogin);
    elements.usernameInput.addEventListener('keypress', handleLoginKeypress);
    elements.passwordInput.addEventListener('keypress', handleLoginKeypress);

    // Category dropdown
    elements.categoryDropdownBtn.addEventListener('click', toggleCategoryDropdown);
    
    // Category selection
    const categoryItems = elements.categoryDropdown.querySelectorAll('.dropdown-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            selectCategory(category);
        });
    });

    // Download buttons
    elements.downloadSelectedBtn.addEventListener('click', downloadSelectedCategory);
    elements.downloadAllBtn.addEventListener('click', downloadAll);

    // Modal close
    elements.closeModal.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === elements.fileModal) {
            closeModal();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        const isDropdownClick = event.target.closest('.dropdown-btn') || event.target.closest('.dropdown-content');
        if (!isDropdownClick && elements.categoryDropdown) {
            elements.categoryDropdown.classList.remove('show');
            elements.categoryDropdownArrow.style.transform = 'rotate(0deg)';
        }
    });
}

// Login functions
function showLoginModal() {
    elements.loginModal.style.display = 'block';
}

function handleLoginKeypress(e) {
    if (e.key === 'Enter') {
        attemptLogin();
    }
}

function attemptLogin() {
    const username = elements.usernameInput.value.trim();
    const password = elements.passwordInput.value;
    
    if (validCredentials[username] && validCredentials[username] === password) {
        isLoggedIn = true;
        currentUser = username;
        elements.loginModal.style.display = 'none';
        showToast(`Welcome, ${username}! Access granted to dataset repository.`);
        populateFileList();
        showUserInfo();
    } else {
        elements.loginError.style.display = 'block';
        elements.loginError.textContent = 'Invalid username or password. Please check your credentials.';
        
        // Clear password field
        elements.passwordInput.value = '';
        elements.passwordInput.focus();
        
        setTimeout(() => {
            elements.loginError.style.display = 'none';
        }, 3000);
    }
}

function showUserInfo() {
    const header = document.querySelector('.repo-header');
    const existingUserInfo = header.querySelector('.user-info');
    
    // Remove existing user info if present
    if (existingUserInfo) {
        existingUserInfo.remove();
    }
    
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `Logged in as: <strong>${currentUser}</strong> | <span class="logout-link" onclick="logout()">Logout</span>`;
    header.appendChild(userInfo);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        isLoggedIn = false;
        currentUser = '';
        location.reload();
    }
}

// Authentication check
function checkAuth() {
    if (!isLoggedIn) {
        showToast('Please login to access this feature');
        return false;
    }
    return true;
}

// Category dropdown functions
function toggleCategoryDropdown() {
    elements.categoryDropdown.classList.toggle('show');
    const isOpen = elements.categoryDropdown.classList.contains('show');
    elements.categoryDropdownArrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
}

function selectCategory(category) {
    selectedCategory = category;
    const categoryData = dataCategories[category];
    
    if (categoryData) {
        elements.selectedCategory.textContent = categoryData.name;
        elements.downloadSelectedBtn.disabled = false;
        
        // Close dropdown
        elements.categoryDropdown.classList.remove('show');
        elements.categoryDropdownArrow.style.transform = 'rotate(0deg)';
        
        // Show available datasets popup
        showCategoryDatasets(category);
    }
}

function showCategoryDatasets(category) {
    if (!category) return;
    
    const categoryData = dataCategories[category];
    if (!categoryData || categoryData.files.length === 0) {
        showToast('No files found in this category');
        return;
    }
    
    elements.modalTitle.textContent = `Available Files: ${categoryData.name}`;
    
    let content = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #58a6ff; margin-bottom: 15px;">Files in ${categoryData.name}</h3>
            <div style="background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 20px;">
    `;
    
    categoryData.files.forEach((file) => {
        content += `
            <div style="background: #161b22; border: 1px solid #21262d; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                        <h4 style="color: #e6edf3; margin: 0; font-size: 16px;">${file.name}</h4>
                        <p style="color: #8b949e; margin: 5px 0 0 0; font-size: 14px;">${file.path}</p>
                        <p style="color: #8b949e; margin: 5px 0 0 0; font-size: 12px;">Type: ${file.type}</p>
                    </div>
                    <span style="color: #58a6ff; font-weight: 600; font-size: 14px;">${file.size}</span>
                </div>
                <button class="download-btn-primary" onclick="downloadFile('${file.name}')" style="margin-top: 10px; font-size: 12px; padding: 6px 12px;">
                    Download File
                </button>
            </div>
        `;
    });
    
    content += `
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button class="download-btn-primary" onclick="downloadAllCategoryFiles('${category}')" style="padding: 12px 24px;">
                    Download All ${categoryData.name} Files
                </button>
            </div>
        </div>
    `;
    
    elements.previewContent.innerHTML = content;
    elements.fileModal.style.display = 'block';
}

// Download functions
function downloadSelectedCategory() {
    if (!checkAuth()) return;
    
    if (!selectedCategory) {
        showToast('Please select a category first');
        return;
    }

    const categoryData = dataCategories[selectedCategory];
    if (!categoryData || categoryData.files.length === 0) {
        showToast('No files found in selected category');
        return;
    }

    showProgress();
    showToast(`Preparing ${categoryData.name} download...`);
    
    // Simulate download progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress > 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Create download content
            let downloadContent = `=== ${categoryData.name.toUpperCase()} FILES ===\n\n`;
            downloadContent += `Category: ${categoryData.name}\n`;
            downloadContent += `Total Files: ${categoryData.files.length}\n`;
            downloadContent += `Download Date: ${new Date().toISOString().split('T')[0]}\n\n`;
            
            categoryData.files.forEach(file => {
                downloadContent += `FILE: ${file.name}\n`;
                downloadContent += `SIZE: ${file.size}\n`;
                downloadContent += `TYPE: ${file.type}\n`;
                downloadContent += `PATH: ${file.path}\n`;
                downloadContent += '\n' + '='.repeat(60) + '\n\n';
            });
            
            // Create and trigger download
            const blob = new Blob([downloadContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedCategory}_files.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            hideProgress();
            showToast(`${categoryData.name} files downloaded successfully!`);
        }
        updateProgress(progress, `Downloading ${categoryData.name}...`);
    }, 120);
}

function downloadAllCategoryFiles(category) {
    selectedCategory = category;
    downloadSelectedCategory();
}

function downloadFile(fileName) {
    if (!checkAuth()) return;
    
    showProgress();
    
    const file = files.find(f => f.name === fileName);
    if (!file) return;

    // Simulate download progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Create and download file
            const blob = new Blob([file.content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            hideProgress();
            showToast(`Downloaded ${fileName} successfully!`);
        }
        updateProgress(progress, `Downloading ${fileName}...`);
    }, 100);
}

function downloadAll() {
    if (!checkAuth()) return;
    
    showProgress();
    showToast('Preparing bulk download...');
    
    // Simulate bulk download preparation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Create ZIP-like download
            const allContent = files.map(file => 
                `--- ${file.name} (${file.size}) ---\n${file.content}\n\n`
            ).join('\n');
            
            const blob = new Blob([allContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'epidemiological-analysis-datasets.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            hideProgress();
            showToast('All files downloaded successfully!');
        }
        updateProgress(progress, 'Creating archive...');
    }, 150);
}

// File list and preview functions
function populateFileList() {
    elements.fileList.innerHTML = '';

    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.className = 'file-item';
        
        listItem.innerHTML = `
            <span class="file-icon">${file.icon}</span>
            <div class="file-info">
                <div>
                    <a href="#" class="file-name">${file.name}</a>
                    <div style="font-size: 11px; color: #8b949e; margin-top: 2px;">${file.path}</div>
                </div>
                <span class="file-size">${file.size}</span>
            </div>
            <button class="download-btn">⬇️</button>
        `;
        
        // Add event listeners to the newly created elements
        const fileName = listItem.querySelector('.file-name');
        const downloadBtn = listItem.querySelector('.download-btn');
        
        fileName.addEventListener('click', (e) => {
            e.preventDefault();
            previewFile(file.name);
        });
        
        downloadBtn.addEventListener('click', () => {
            downloadFile(file.name);
        });
        
        elements.fileList.appendChild(listItem);
    });
}

function previewFile(fileName) {
    const file = files.find(f => f.name === fileName);
    if (!file) return;

    elements.modalTitle.textContent = `${file.icon} ${fileName}`;

    let content = '';
    if (file.type === 'python' || file.type === 'text' || file.type === 'json' || file.type === 'csv') {
        content = `<div class="code-preview">${escapeHtml(file.content)}</div>`;
    } else if (file.type === 'markdown') {
        content = `<div class="code-preview">${escapeHtml(file.content)}</div>`;
    } else if (file.type === 'excel') {
        content = `
            <div style="padding: 20px; text-align: center; color: #8b949e;">
                <div style="font-size: 48px; margin-bottom: 10px;">${file.icon}</div>
                <p><strong>Excel File Preview</strong></p>
                <p>${file.content}</p>
                <br>
                <button class="download-all-btn" onclick="downloadFile('${fileName}')">
                    ⬇️ Download to view full content
                </button>
            </div>
        `;
    }

    elements.previewContent.innerHTML = content;
    elements.fileModal.style.display = 'block';
}

function closeModal() {
    elements.fileModal.style.display = 'none';
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showProgress() {
    elements.downloadProgress.style.display = 'block';
    elements.downloadIdle.style.display = 'none';
}

function hideProgress() {
    elements.downloadProgress.style.display = 'none';
    elements.downloadIdle.style.display = 'block';
}

function updateProgress(percent, text) {
    elements.progressFill.style.width = percent + '%';
    elements.progressText.textContent = text;
}

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Make logout function available globally for the user info link
window.logout = logout;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
