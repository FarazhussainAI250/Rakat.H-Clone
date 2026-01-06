// Clones Library JavaScript

// Function to create new clone
function createNewClone() {
  document.getElementById('createCloneModal').style.display = 'block';
}

// Function to close create clone modal
function closeCreateCloneModal() {
  document.getElementById('createCloneModal').style.display = 'none';
  document.getElementById('createCloneForm').reset();
  document.getElementById('fileName').textContent = '';
}

// Function to handle file upload
function handleFileUpload(input) {
  const file = input.files[0];
  const fileName = document.getElementById('fileName');
  
  if (file) {
    // Check file size (25MB = 25 * 1024 * 1024 bytes)
    const maxSize = 25 * 1024 * 1024;
    
    if (file.size > maxSize) {
      alert('File size must be less than 25MB!');
      input.value = '';
      fileName.textContent = '';
      return;
    }
    
    // Check file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/mp4'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
      alert('Please upload MP3, WAV, or M4A files only!');
      input.value = '';
      fileName.textContent = '';
      return;
    }
    
    fileName.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
  }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('createCloneForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cloneName = document.getElementById('cloneName').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const language = document.getElementById('cloneLanguage').value;
    const voiceFile = document.getElementById('voiceFile').files[0];
    
    if (!cloneName || !gender || !language || !voiceFile) {
      alert('Please fill all required fields!');
      return;
    }
    
    // Create new clone card
    createCloneCard(cloneName, gender, language);
    
    // Close modal
    closeCreateCloneModal();
    
    alert(`Voice clone "${cloneName}" created successfully!`);
  });
});

// Function to create new clone card
function createCloneCard(name, gender, language) {
  const clonesGrid = document.querySelector('.clones-grid');
  
  const cloneCard = document.createElement('div');
  cloneCard.className = 'clone-card';
  cloneCard.innerHTML = `
    <div class="clone-header">
      <div class="clone-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#4ecca3" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        </svg>
      </div>
      <h3 class="clone-name">${name}</h3>
      <button class="delete-btn" onclick="deleteClone('${name}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
        </svg>
      </button>
    </div>
    <div class="clone-details">
      <div class="clone-info">
        <span class="info-label">Gender</span>
        <span class="info-value">${gender}</span>
      </div>
      <div class="clone-info">
        <span class="info-label">Language</span>
        <span class="info-value">${getLanguageName(language)}</span>
      </div>
      <div class="clone-feature">
        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#4ecca3" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9 17 14.74 18.18 21.02 12 17.77 5.82 21.02 7 14.74 2 9 8.91 8.26 12 2"></polygon>
        </svg>
        <span>Ultra-Realistic Voice Enabled</span>
      </div>
    </div>
  `;
  
  clonesGrid.appendChild(cloneCard);
  
  // Update dashboard dropdown
  updateDashboardDropdown(name, gender);
}

// Function to update dashboard dropdown with new clone
function updateDashboardDropdown(name, gender) {
  // Store clone data in localStorage
  let clones = JSON.parse(localStorage.getItem('voiceClones') || '[]');
  
  // Check if clone already exists
  const existingClone = clones.find(clone => clone.name === name);
  if (!existingClone) {
    clones.push({ name, gender, language: document.getElementById('cloneLanguage').value });
    localStorage.setItem('voiceClones', JSON.stringify(clones));
  }
}

// Function to update profile UI
function updateProfileUI() {
  const user = JSON.parse(localStorage.getItem('voiceAppUser') || '{}');
  if (user.name) {
    document.getElementById('welcomeMessage').textContent = `Welcome, ${user.name}`;
    
    const profilePic = document.getElementById('profilePic');
    if (user.profilePic) {
      profilePic.style.backgroundImage = `url(${user.profilePic})`;
      profilePic.style.backgroundSize = 'cover';
      profilePic.style.backgroundPosition = 'center';
      profilePic.textContent = '';
    } else {
      profilePic.textContent = user.name.charAt(0).toUpperCase();
    }
  }
}

// Function to get language name from code
function getLanguageName(code) {
  const languages = {
    'en-us': 'English (US)',
    'en-uk': 'English (UK)',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'ur': 'Urdu',
    'tr': 'Turkish',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'fi': 'Finnish'
  };
  return languages[code] || code;
}

// Function to delete clone
function deleteClone(cloneName) {
  if (confirm(`Are you sure you want to delete "${cloneName}" voice clone?`)) {
    // Find and remove the clone card
    const cloneCards = document.querySelectorAll('.clone-card');
    cloneCards.forEach(card => {
      const nameElement = card.querySelector('.clone-name');
      if (nameElement && nameElement.textContent.trim() === cloneName) {
        // Add fade out animation
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        
        // Remove after animation
        setTimeout(() => {
          card.remove();
        }, 300);
      }
    });
    
    // Remove from localStorage
    let clones = JSON.parse(localStorage.getItem('voiceClones') || '[]');
    clones = clones.filter(clone => clone.name !== cloneName);
    localStorage.setItem('voiceClones', JSON.stringify(clones));
    
    console.log(`Deleted clone: ${cloneName}`);
  }
}

// Function to go back to dashboard
function goToDashboard() {
  window.location.href = 'dashboard.html';
}

// Function to go home (logout)
function goHome() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('voiceAppUser');
    window.location.href = 'index.html';
  }
}

// Function to open profile modal (if needed)
function openProfileModal() {
  // Redirect to dashboard or implement profile modal
  window.location.href = 'dashboard.html';
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
  updateProfileUI();
  loadSavedClones();
  
  // Add hover effects to clone cards
  const cloneCards = document.querySelectorAll('.clone-card');
  cloneCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});

// Function to load saved clones from localStorage
function loadSavedClones() {
  const savedClones = JSON.parse(localStorage.getItem('voiceClones') || '[]');
  const clonesGrid = document.querySelector('.clones-grid');
  
  savedClones.forEach(clone => {
    const cloneCard = document.createElement('div');
    cloneCard.className = 'clone-card';
    cloneCard.innerHTML = `
      <div class="clone-header">
        <div class="clone-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#4ecca3" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          </svg>
        </div>
        <h3 class="clone-name">${clone.name}</h3>
        <button class="delete-btn" onclick="deleteClone('${clone.name}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
          </svg>
        </button>
      </div>
      <div class="clone-details">
        <div class="clone-info">
          <span class="info-label">Gender</span>
          <span class="info-value">${clone.gender}</span>
        </div>
        <div class="clone-info">
          <span class="info-label">Language</span>
          <span class="info-value">${getLanguageName(clone.language)}</span>
        </div>
        <div class="clone-feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#4ecca3" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9 17 14.74 18.18 21.02 12 17.77 5.82 21.02 7 14.74 2 9 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Ultra-Realistic Voice Enabled</span>
        </div>
      </div>
    `;
    
    clonesGrid.appendChild(cloneCard);
  });
}