// Admin settings - ye values admin dashboard se aayengi
let adminSettings = {
  maxCharacters: 60000 // Default value, admin se update hogi
};

// Selected voice options
let selectedOptions = {
  language: 'en-us',
  maleVoice: null,
  femaleVoice: null,
  kidsVoice: null,
  voiceStyle: 'default'
};

function updateCharacterCount() {
  const textInput = document.getElementById('textInput');
  const characterCounter = document.getElementById('characterCounter');
  const remainingCounter = document.getElementById('remainingCounter');
  
  // Status card elements
  const usedChars = document.getElementById('usedChars');
  const totalChars = document.getElementById('totalChars');
  const usageLabel = document.getElementById('usageLabel');
  const progressFill = document.getElementById('progressFill');
  
  const maxChars = adminSettings.maxCharacters;
  const currentLength = textInput.value.length;
  const remaining = maxChars - currentLength;
  const usagePercent = ((currentLength / maxChars) * 100).toFixed(1);
  
  // Update bottom counter (no total, just current and remaining)
  characterCounter.textContent = `${currentLength} characters`;
  remainingCounter.textContent = `Remaining: ${remaining}`;
  
  // Update top status card
  usedChars.textContent = currentLength.toLocaleString();
  totalChars.textContent = maxChars.toLocaleString();
  usageLabel.textContent = `Usage: ${usagePercent}%`;
  progressFill.style.width = `${usagePercent}%`;
  
  // Change colors based on usage
  if (remaining < 1000) {
    remainingCounter.style.color = '#ff4d4d';
    progressFill.style.background = '#ff4d4d';
  } else if (remaining < 5000) {
    remainingCounter.style.color = '#ffa500';
    progressFill.style.background = '#ffa500';
  } else {
    remainingCounter.style.color = '#4ecca3';
    progressFill.style.background = '#4ecca3';
  }
}

// Enhanced dropdown functionality for all dropdowns
function setupDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');
  
  dropdowns.forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const optionItems = dropdown.querySelectorAll('.dropdown-option');
    const searchInput = dropdown.querySelector('.language-search');
    
    // Toggle dropdown on click
    selected.onclick = function(e) {
      e.stopPropagation();
      
      // Close all other dropdowns first
      dropdowns.forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          const otherOptions = otherDropdown.querySelector('.dropdown-options');
          otherOptions.style.display = 'none';
          otherOptions.classList.remove('show');
        }
      });
      
      // Toggle current dropdown
      if (options.style.display === 'block') {
        options.style.display = 'none';
        options.classList.remove('show');
      } else {
        options.style.display = 'block';
        options.classList.add('show');
        
        // Focus search input if it exists
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    };
    
    // Handle option selection
    optionItems.forEach(option => {
      option.onclick = function(e) {
        e.stopPropagation();
        const text = this.textContent.trim();
        const icon = this.querySelector('svg');
        
        // Update selected display
        const span = selected.querySelector('span');
        span.innerHTML = '';
        
        if (icon) {
          const clonedIcon = icon.cloneNode(true);
          span.appendChild(clonedIcon);
        }
        
        span.appendChild(document.createTextNode(' ' + text));
        
        // Store selected value
        dropdown.setAttribute('data-selected', this.getAttribute('data-value') || text);
        
        // Hide dropdown
        options.style.display = 'none';
        options.classList.remove('show');
      };
    });
    
    // Search functionality for language dropdown
    if (searchInput) {
      searchInput.oninput = function(e) {
        e.stopPropagation();
        const searchTerm = this.value.toLowerCase();
        
        optionItems.forEach(option => {
          const text = option.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            option.style.display = 'block';
          } else {
            option.style.display = 'none';
          }
        });
      };
      
      // Prevent dropdown from closing when clicking on search input
      searchInput.onclick = function(e) {
        e.stopPropagation();
      };
    }
  });
  
  // Close all dropdowns when clicking outside
  document.onclick = function(e) {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        const options = dropdown.querySelector('.dropdown-options');
        options.style.display = 'none';
        options.classList.remove('show');
      }
    });
  };
}

// Function to update admin settings (call this from admin dashboard)
function updateAdminSettings(newMaxChars) {
  adminSettings.maxCharacters = newMaxChars;
  // Update textarea max length
  document.getElementById('textInput').setAttribute('maxlength', newMaxChars);
  // Refresh display
  updateCharacterCount();
}

// Initialize on page load
window.onload = function() {
  updateCharacterCount();
  setupDropdowns();
  loadVoiceClones();
};

// Function to load voice clones into dropdown
function loadVoiceClones() {
  const clones = JSON.parse(localStorage.getItem('voiceClones') || '[]');
  const voiceCloneDropdown = document.querySelector('[data-dropdown="voice-clone"] .dropdown-options');
  
  if (voiceCloneDropdown) {
    // Clear existing dynamic options (keep only default ones)
    const defaultOptions = voiceCloneDropdown.querySelectorAll('.dropdown-option');
    const defaultCloneNames = ['naveed', 'shahzad', 'naveed-m', 'naveed-i', 'mrc', 'm-r'];
    
    // Remove non-default options
    defaultOptions.forEach(option => {
      const value = option.getAttribute('data-value');
      if (!defaultCloneNames.includes(value)) {
        option.remove();
      }
    });
    
    // Add saved clones to dropdown
    clones.forEach(clone => {
      const option = document.createElement('div');
      option.className = 'dropdown-option';
      option.setAttribute('data-value', clone.name.toLowerCase().replace(/\s+/g, '-'));
      option.innerHTML = `
        <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        </svg>
        ${clone.name} (${clone.gender})
      `;
      voiceCloneDropdown.appendChild(option);
    });
    
    // Re-setup dropdown functionality for new options
    setupDropdowns();
  }
}

// Voice generation functionality
function generateVoice() {
  const textInput = document.getElementById('textInput');
  const text = textInput.value.trim();
  
  if (!text) {
    alert('Please enter some text to generate voice.');
    return;
  }
  
  // Get selected values from dropdowns
  const language = document.querySelector('[data-dropdown="language"]').getAttribute('data-selected') || 'en-us';
  const maleVoice = document.querySelector('[data-dropdown="male-voice"]').getAttribute('data-selected') || 'default';
  const femaleVoice = document.querySelector('[data-dropdown="female-voice"]').getAttribute('data-selected') || 'default';
  const kidsVoice = document.querySelector('[data-dropdown="kids-voice"]').getAttribute('data-selected') || 'default';
  const voiceStyle = document.querySelector('[data-dropdown="voice-style"]').getAttribute('data-selected') || 'default';
  
  console.log('Generating voice with:', {
    text,
    language,
    maleVoice,
    femaleVoice,
    kidsVoice,
    voiceStyle
  });
  
  // Show loading state
  const generateBtn = document.querySelector('.btn-primary');
  const originalText = generateBtn.textContent;
  generateBtn.textContent = 'Generating...';
  generateBtn.disabled = true;
  
  // Simulate API call (replace with actual API integration)
  setTimeout(() => {
    // Reset button
    generateBtn.textContent = originalText;
    generateBtn.disabled = false;
    
    // Enable audio player and hide placeholder
    const audioPreview = document.getElementById('audioPreview');
    const audioElement = audioPreview.querySelector('audio');
    const placeholder = audioPreview.querySelector('.audio-placeholder');
    
    audioElement.removeAttribute('disabled');
    placeholder.classList.add('hidden');
    
    alert('Voice generated successfully! (This is a demo)');
  }, 2000);
}

// Download functionality
function downloadMP3() {
  const audioPreview = document.getElementById('audioPreview');
  
  if (audioPreview.style.display === 'none' || !audioPreview.style.display) {
    alert('Please generate voice first.');
    return;
  }
  
  // Mock download (replace with actual download logic)
  alert('Download started! (This is a demo)');
}

// Select Clone functionality
function selectClone() {
  window.location.href = 'cloneslibrary.html';
}

// Home navigation
function goHome() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('voiceAppUser');
    window.location.href = 'index.html';
  }
}