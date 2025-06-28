// DOM Elements
const capitalInput = document.getElementById('capital');
const marginInput = document.getElementById('margin');
const marginSlider = document.getElementById('marginSlider');
const marginPercentage = document.getElementById('marginPercentage');
const riskInput = document.getElementById('risk');
const riskSlider = document.getElementById('riskSlider');
const riskPercentage = document.getElementById('riskPercentage');
const stopLossInput = document.getElementById('stopLoss');
const calculateBtn = document.getElementById('calculateBtn');
const leverageResult = document.getElementById('leverageResult');
const themeToggle = document.getElementById('themeToggle');
const resultBox = document.querySelector('.result-box');

// Initialize variables
let isHighRisk = false;

// Helper functions
function enableElement(element) {
    element.disabled = false;
    element.style.opacity = "1";
}

function disableElement(element) {
    element.disabled = true;
    element.style.opacity = "0.6";
}

function clearMarginFields() {
    marginInput.value = "";
    marginSlider.value = "5";
    marginPercentage.textContent = "5%";
}

function clearRiskFields() {
    riskInput.value = "";
    riskSlider.value = "50";
    riskPercentage.textContent = "50%";
}

function clearStopLoss() {
    stopLossInput.value = "";
}

function clearResult() {
    leverageResult.textContent = "--";
    resultBox.classList.remove("high-risk");
    resultBox.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
    const warning = document.querySelector('.risk-warning');
    if (warning) warning.remove();
}

function updateRiskAuto() {
    const margin = parseFloat(marginInput.value) || 0;
    if (margin > 0) {
        const riskValue = margin / 2;
        riskInput.value = riskValue.toFixed(2);
        
        const riskPercentageValue = 50; // Because risk = margin / 2 => 50%
        riskSlider.value = riskPercentageValue;
        riskPercentage.textContent = `${riskPercentageValue}%`;
        
        enableElement(riskInput);
        enableElement(riskSlider);
        enableElement(stopLossInput);
    }
}

function updateMarginFromSlider() {
    const capital = parseFloat(capitalInput.value) || 0;
    const percentage = parseInt(marginSlider.value);
    
    if (capital > 0) {
        const marginValue = (capital * percentage) / 100;
        marginInput.value = marginValue.toFixed(2);
    }
}

function validateInputs() {
    // Capital validation
    const capital = parseFloat(capitalInput.value) || 0;
    const margin = parseFloat(marginInput.value) || 0;
    const risk = parseFloat(riskInput.value) || 0;
    
    // Ensure margin doesn't exceed capital
    if (margin > capital) {
        marginInput.value = capital;
    }
    
    // Ensure risk doesn't exceed margin
    if (risk > margin) {
        riskInput.value = margin;
    }
}

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Capital input logic
capitalInput.addEventListener('input', () => {
    const capital = parseFloat(capitalInput.value);
    
    if (capital > 0) {
        enableElement(marginInput);
        enableElement(marginSlider);
    } else {
        clearMarginFields();
        clearRiskFields();
        clearStopLoss();
        clearResult();
        disableElement(marginInput);
        disableElement(marginSlider);
        disableElement(riskInput);
        disableElement(riskSlider);
        disableElement(stopLossInput);
        disableElement(calculateBtn);
    }
    
    updateMarginFromSlider();
    validateInputs();
});

// Margin input logic
marginInput.addEventListener('input', () => {
    const capital = parseFloat(capitalInput.value) || 0;
    const margin = parseFloat(marginInput.value) || 0;
    
    if (margin > capital) {
        marginInput.value = capital;
    }
    
    if (margin > 0 && capital > 0) {
        const percentage = Math.min(100, Math.round((margin / capital) * 100));
        marginSlider.value = percentage;
        marginPercentage.textContent = `${percentage}%`;
        
        enableElement(riskInput);
        enableElement(riskSlider);
        updateRiskAuto();
        enableElement(stopLossInput);
        enableElement(calculateBtn);
    } else {
        clearRiskFields();
        clearStopLoss();
        clearResult();
        disableElement(riskInput);
        disableElement(riskSlider);
        disableElement(stopLossInput);
        disableElement(calculateBtn);
    }
    
    validateInputs();
});

// Margin slider logic
marginSlider.addEventListener('input', () => {
    const percentage = parseInt(marginSlider.value);
    marginPercentage.textContent = `${percentage}%`;
    
    const capital = parseFloat(capitalInput.value) || 0;
    if (capital > 0) {
        const marginValue = (capital * percentage) / 100;
        marginInput.value = Math.round(marginValue * 100) / 100;
        
        enableElement(riskInput);
        enableElement(riskSlider);
        updateRiskAuto();
        enableElement(stopLossInput);
        enableElement(calculateBtn);
    }
    
    validateInputs();
});

// Risk input logic
riskInput.addEventListener('input', () => {
    const margin = parseFloat(marginInput.value) || 0;
    const risk = parseFloat(riskInput.value) || 0;
    
    if (risk > margin) {
        riskInput.value = margin;
    }
    
    if (risk > 0 && margin > 0) {
        const percentage = (risk / margin) * 100;
        riskSlider.value = Math.min(100, percentage).toFixed(1);
        riskPercentage.textContent = `${Math.min(100, percentage).toFixed(1)}%`;
    }
    
    validateInputs();
});

// Risk slider logic
riskSlider.addEventListener('input', () => {
    const percentage = parseFloat(riskSlider.value);
    riskPercentage.textContent = `${percentage}%`;
    
    const margin = parseFloat(marginInput.value) || 0;
    if (margin > 0) {
        const riskValue = margin * (percentage / 100);
        riskInput.value = riskValue.toFixed(2);
    }
    
    validateInputs();
});

// Stop Loss input logic
stopLossInput.addEventListener('input', () => {
    let stopLoss = parseFloat(stopLossInput.value) || 0;
    
    // Cap stop loss at 100%
    if (stopLoss > 100) {
        stopLossInput.value = 100;
    }
    
    validateInputs();
});

// Calculate button logic
calculateBtn.addEventListener('click', () => {
    const margin = parseFloat(marginInput.value);
    const risk = parseFloat(riskInput.value);
    const stopLoss = parseFloat(stopLossInput.value);
    
    if (margin > 0 && risk > 0 && stopLoss > 0) {
        // Calculate leverage
        const leverage = (risk * 100) / (stopLoss * margin);
        const roundedLeverage = Math.round(leverage);
        
        // Display result
        leverageResult.textContent = roundedLeverage + "x";
        
        // Check for high risk
        const marginPercentage = (margin / parseFloat(capitalInput.value)) * 100;
        const riskPercentage = (risk / margin) * 100;
        
        isHighRisk = false;
        
        // Remove existing warning if any
        const warning = document.querySelector('.risk-warning');
        if (warning) warning.remove();
        
        // Check if high risk
        if (marginPercentage > 75 || riskPercentage > 75) {
            isHighRisk = true;
            resultBox.classList.add("high-risk");
            resultBox.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
            
            const warningElement = document.createElement('div');
            warningElement.className = 'risk-warning';
            warningElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> ⚠️ High-Risk';
            resultBox.appendChild(warningElement);
        } else {
            resultBox.style.background = "linear-gradient(135deg, #10b981, #059669)";
        }
    }
});

// Initialize form state
disableElement(marginInput);
disableElement(marginSlider);
disableElement(riskInput);
disableElement(riskSlider);
disableElement(stopLossInput);
disableElement(calculateBtn);
