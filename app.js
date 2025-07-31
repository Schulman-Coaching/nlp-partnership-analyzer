// Application State
let appState = {
    currentSection: 'dashboard',
    isProcessing: false,
    currentDocument: null,
    analysisResults: {},
    settings: {
        nlpModel: 'LegalBERT v2.1',
        confidenceThreshold: 85,
        defaultTaxSoftware: 'GoSystem Tax',
        processingPriority: 'Accuracy'
    }
};

// Sample data for demonstration
const sampleData = {
    partnershipComponents: {
        "distribution_waterfall": {
            "description": "Method of allocating capital gains between limited and general partners",
            "typical_structure": [
                "Return of capital contributions",
                "Preferred return (6-10% annually)",
                "Catchup provision (GP receives larger share)",
                "Carried interest split (typically 20% to GP, 80% to LPs)"
            ]
        },
        "preferred_return": {
            "description": "Minimum return threshold paid to limited partners before GP receives promoted interest",
            "typical_rates": "6-10% annually",
            "calculation_methods": ["Simple interest", "Compound interest", "Cumulative", "Non-cumulative"]
        }
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Partnership AI application...');
    initializeNavigation();
    initializeFileUpload(); 
    initializeModals();
    initializeSettings();
    initializePlatforms();
    loadDemoData();
    console.log('Application initialized successfully');
});

// Navigation System
function initializeNavigation() {
    console.log('Setting up navigation...');
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    console.log(`Found ${navLinks.length} nav links and ${sections.length} sections`);
    
    navLinks.forEach((link, index) => {
        console.log(`Setting up nav link ${index}: ${link.getAttribute('data-section')}`);
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            console.log(`Navigation clicked: ${targetSection}`);
            switchToSection(targetSection);
        });
    });
}

function switchToSection(sectionName) {
    console.log(`Switching to section: ${sectionName}`);
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Update nav active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    // Update section visibility
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionName) {
            section.classList.add('active');
            console.log(`Activated section: ${sectionName}`);
        }
    });
    
    appState.currentSection = sectionName;
}

// File Upload System
function initializeFileUpload() {
    console.log('Setting up file upload...');
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseButton = uploadArea.querySelector('.btn--primary');
    
    if (!uploadArea || !fileInput) {
        console.error('Upload elements not found');
        return;
    }
    
    // Browse button click
    browseButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Browse button clicked');
        fileInput.click();
    });
    
    // Upload area click (but not when clicking the button)
    uploadArea.addEventListener('click', function(e) {
        if (e.target !== browseButton && !browseButton.contains(e.target)) {
            console.log('Upload area clicked');
            fileInput.click();
        }
    });
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        console.log('File input changed');
        handleFileSelection(e);
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
}

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    processFiles(files);
}

function handleFileSelection(e) {
    const files = e.target.files;
    console.log(`Files selected: ${files.length}`);
    processFiles(files);
}

function processFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    console.log(`Processing file: ${file.name} (${file.type})`);
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    const isValidType = allowedTypes.includes(file.type) || allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
        showNotification('Please upload a PDF or DOC file.', 'error');
        return;
    }
    
    // Start processing simulation
    startDocumentProcessing(file);
}

function startDocumentProcessing(file) {
    console.log(`Starting processing for: ${file.name}`);
    appState.isProcessing = true;
    appState.currentDocument = file.name;
    
    // Switch to analysis section
    switchToSection('analysis');
    
    // Update processing status
    updateProcessingStatus(file.name);
    
    // Simulate processing stages
    simulateProcessingStages();
}

function updateProcessingStatus(filename) {
    const statusElement = document.querySelector('.processing-status h3');
    if (statusElement) {
        statusElement.textContent = `Processing: ${filename}`;
    }
}

function simulateProcessingStages() {
    const stages = document.querySelectorAll('.stage');
    let currentStage = 0;
    
    // Reset all stages first
    stages.forEach(stage => {
        stage.classList.remove('active', 'completed');
    });
    
    const processStage = () => {
        if (currentStage < stages.length) {
            // Mark previous stages as completed
            for (let i = 0; i < currentStage; i++) {
                stages[i].classList.remove('active');
                stages[i].classList.add('completed');
            }
            
            // Mark current stage as active
            if (stages[currentStage]) {
                stages[currentStage].classList.add('active');
            }
            
            currentStage++;
            
            // Continue to next stage after delay
            setTimeout(processStage, 2000 + Math.random() * 1000);
        } else {
            // Processing complete
            completeProcessing();
        }
    };
    
    processStage();
}

function completeProcessing() {
    console.log('Processing completed');
    
    // Mark all stages as completed
    const stages = document.querySelectorAll('.stage');
    stages.forEach(stage => {
        stage.classList.remove('active');
        stage.classList.add('completed');
    });
    
    // Load extracted components
    loadExtractedComponents();
    
    // Show completion notification
    showNotification('Document analysis completed successfully!', 'success');
    
    appState.isProcessing = false;
}

function loadExtractedComponents() {
    console.log('Loading extracted components');
    
    // Sample extracted data
    const components = [
        {
            title: 'Distribution Waterfall',
            confidence: 95,
            content: `
<ul>
<li>Return of capital contributions - 100% to LPs</li>
<li>8% preferred return - 100% to LPs</li>
<li>Catchup - 100% to GP until 20% total return</li>
<li>Carried interest - 20% GP, 80% LPs</li>
</ul>
            `
        },
        {
            title: 'Preferred Return',
            confidence: 88,
            content: `
<p><strong>Rate:</strong> 8% annually</p>
<p><strong>Method:</strong> Cumulative compound</p>
<p><strong>Calculation:</strong> Based on capital contributions</p>
            `
        },
        {
            title: 'Capital Call Provisions',
            confidence: 92,
            content: `
<p><strong>Notice Period:</strong> 45 days</p>
<p><strong>Default Interest:</strong> 12% per annum</p>
<p><strong>Remedies:</strong> Dilution, suspension of rights</p>
            `
        },
        {
            title: 'Special Allocations',
            confidence: 86,
            content: `
<ul>
<li>Depreciation allocated 90% to LPs</li>
<li>Section 704(c) gain allocated to contributing partner</li>
<li>Minimum gain chargeback provisions included</li>
</ul>
            `
        }
    ];
    
    // Update component cards with extracted data
    const componentCards = document.querySelectorAll('.component-card');
    componentCards.forEach((card, index) => {
        if (components[index]) {
            const confidenceElement = card.querySelector('.confidence-score');
            const contentElement = card.querySelector('.component-content');
            
            if (confidenceElement) {
                confidenceElement.textContent = `Confidence: ${components[index].confidence}%`;
            }
            if (contentElement) {
                contentElement.innerHTML = components[index].content;
            }
        }
    });
}

// Modal System
function initializeModals() {
    console.log('Setting up modals...');
    
    const editModal = document.getElementById('editModal');
    
    // Edit component buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-component')) {
            const card = e.target.closest('.component-card');
            const title = card.querySelector('h4').textContent;
            const content = card.querySelector('.component-content').innerHTML;
            const confidenceText = card.querySelector('.confidence-score').textContent;
            const confidence = confidenceText.match(/\d+/)[0];
            
            openEditModal(title, content, confidence);
        }
    });
    
    // Modal close buttons
    const closeButton = document.querySelector('.modal-close');
    const cancelButton = document.querySelector('.cancel-edit');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeEditModal);
    }
    if (cancelButton) {
        cancelButton.addEventListener('click', closeEditModal);
    }
    
    // Save component button
    const saveButton = document.querySelector('.save-component');
    if (saveButton) {
        saveButton.addEventListener('click', saveComponentChanges);
    }
    
    // Confidence slider
    const confidenceSlider = document.getElementById('confidenceSlider');
    const confidenceValue = document.getElementById('confidenceValue');
    
    if (confidenceSlider && confidenceValue) {
        confidenceSlider.addEventListener('input', function() {
            confidenceValue.textContent = this.value + '%';
        });
    }
    
    // Close modal on backdrop click
    if (editModal) {
        editModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeEditModal();
            }
        });
    }
}

function openEditModal(title, content, confidence) {
    const modalTitle = document.getElementById('modalTitle');
    const componentData = document.getElementById('componentData');
    const confidenceSlider = document.getElementById('confidenceSlider');
    const confidenceValue = document.getElementById('confidenceValue');
    const editModal = document.getElementById('editModal');
    
    if (modalTitle) modalTitle.textContent = `Edit ${title}`;
    if (componentData) componentData.value = content.replace(/<[^>]*>/g, '').trim();
    if (confidenceSlider) confidenceSlider.value = confidence;
    if (confidenceValue) confidenceValue.textContent = confidence + '%';
    if (editModal) editModal.classList.remove('hidden');
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.add('hidden');
    }
}

function saveComponentChanges() {
    showNotification('Component changes saved successfully!', 'success');
    closeEditModal();
}

// Platform Configuration
function initializePlatforms() {
    console.log('Setting up platforms...');
    
    // Platform configuration buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('configure-platform')) {
            const platform = e.target.getAttribute('data-platform');
            configurePlatform(platform);
        }
    });
    
    // Integration action buttons
    const exportButton = document.querySelector('.export-config');
    const validateButton = document.querySelector('.validate-mapping');
    const syncButton = document.querySelector('.sync-data');
    
    if (exportButton) {
        exportButton.addEventListener('click', exportConfiguration);
    }
    if (validateButton) {
        validateButton.addEventListener('click', validateMapping);
    }
    if (syncButton) {
        syncButton.addEventListener('click', syncToTaxSoftware);
    }
}

function configurePlatform(platform) {
    const platformNames = {
        'gosystem': 'GoSystem Tax',
        'thomson': 'Thomson Reuters UlaTax',
        'cch': 'CCH Axcess'
    };
    
    showNotification(`Configuring ${platformNames[platform]} integration...`, 'info');
    
    // Simulate configuration
    setTimeout(() => {
        showNotification(`${platformNames[platform]} configured successfully!`, 'success');
    }, 2000);
}

function exportConfiguration() {
    showNotification('Configuration exported to XML file', 'success');
    
    // Simulate file download
    const configData = `<?xml version="1.0"?>
<TaxConfiguration>
    <Partnership>
        <DistributionWaterfall>
            <Tier1>Return of capital contributions - 100% to LPs</Tier1>
            <Tier2>8% preferred return - 100% to LPs</Tier2>
            <Tier3>Catchup - 100% to GP until 20% total return</Tier3>
            <Tier4>Carried interest - 20% GP, 80% LPs</Tier4>
        </DistributionWaterfall>
    </Partnership>
</TaxConfiguration>`;
    
    const blob = new Blob([configData], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partnership_tax_config.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function validateMapping() {
    showNotification('Validating tax form mappings...', 'info');
    
    setTimeout(() => {
        showNotification('All mappings validated successfully!', 'success');
    }, 1500);
}

function syncToTaxSoftware() {
    showNotification('Syncing data to GoSystem Tax...', 'info');
    
    setTimeout(() => {
        showNotification('Data synchronized successfully!', 'success');
    }, 3000);
}

// Settings System
function initializeSettings() {
    console.log('Setting up settings...');
    
    // Range sliders
    document.addEventListener('input', function(e) {
        if (e.target.type === 'range') {
            const valueDisplay = e.target.nextElementSibling;
            if (valueDisplay && valueDisplay.tagName === 'SPAN') {
                valueDisplay.textContent = e.target.value + '%';
            }
        }
    });
    
    // Settings save/reset buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.settings-actions .btn--primary')) {
            saveSettings();
        } else if (e.target.matches('.settings-actions .btn--outline')) {
            resetSettings();
        }
    });
    
    // API connection buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.api-item .btn')) {
            const apiName = e.target.closest('.api-item').firstElementChild.textContent;
            const isConnect = e.target.textContent === 'Connect';
            
            if (isConnect) {
                showNotification(`Connecting to ${apiName}...`, 'info');
                setTimeout(() => {
                    e.target.textContent = 'Configure';
                    e.target.classList.remove('btn--primary');
                    e.target.classList.add('btn--outline');
                    const status = e.target.previousElementSibling;
                    status.textContent = 'Connected';
                    status.className = 'status status--success';
                    showNotification(`Connected to ${apiName} successfully!`, 'success');
                }, 2000);
            } else {
                showNotification(`Opening ${apiName} configuration...`, 'info');
            }
        }
    });
}

function saveSettings() {
    const selects = document.querySelectorAll('select');
    const ranges = document.querySelectorAll('input[type="range"]');
    
    const settings = {};
    selects.forEach((select, index) => {
        settings[`select_${index}`] = select.value;
    });
    ranges.forEach((range, index) => {
        settings[`range_${index}`] = range.value;
    });
    
    appState.settings = { ...appState.settings, ...settings };
    showNotification('Settings saved successfully!', 'success');
}

function resetSettings() {
    const selects = document.querySelectorAll('select');
    const ranges = document.querySelectorAll('input[type="range"]');
    
    selects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    ranges.forEach(range => {
        range.value = 85;
        const valueDisplay = range.nextElementSibling;
        if (valueDisplay && valueDisplay.tagName === 'SPAN') {
            valueDisplay.textContent = '85%';
        }
    });
    
    showNotification('Settings reset to defaults', 'info');
}

// Demo Data Loading
function loadDemoData() {
    console.log('Loading demo data...');
    updateResultsAnalytics();
    updateRecentResults();
}

function updateResultsAnalytics() {
    // Update structure analysis
    const structureBars = document.querySelectorAll('.structure-fill');
    const structurePercentages = [65, 28, 7];
    
    structureBars.forEach((bar, index) => {
        if (structurePercentages[index]) {
            setTimeout(() => {
                bar.style.width = structurePercentages[index] + '%';
            }, 500 * index);
        }
    });
}

function updateRecentResults() {
    // Demo data already loaded in HTML
    console.log('Recent results loaded');
}

// Notification System
function showNotification(message, type = 'info') {
    console.log(`Notification: ${message} (${type})`);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    // Set background color based on type
    const colors = {
        success: 'var(--color-success)',
        error: 'var(--color-error)', 
        warning: 'var(--color-warning)',
        info: 'var(--color-primary)'
    };
    
    // Use CSS custom properties or fallback colors
    const colorMap = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.backgroundColor = colorMap[type] || colorMap.info;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add required CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Utility Functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export for potential external use
window.PartnershipAI = {
    switchToSection,
    processFiles,
    showNotification,
    appState
};

console.log('Partnership AI application script loaded');