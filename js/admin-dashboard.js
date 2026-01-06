// Admin Dashboard JavaScript Functions

// Update stats dynamically (dummy data)
function updateStats() {
  // This would normally fetch from backend
  const stats = {
    low: Math.floor(Math.random() * 20) + 10,
    middle: Math.floor(Math.random() * 15) + 5,
    high: Math.floor(Math.random() * 10) + 2,
    enterprise: Math.floor(Math.random() * 5) + 1
  };
  
  document.getElementById('lowPlanCount').textContent = stats.low;
  document.getElementById('middlePlanCount').textContent = stats.middle;
  document.getElementById('highPlanCount').textContent = stats.high;
  document.getElementById('enterprisePlanCount').textContent = stats.enterprise;
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'index.html';
  }
}

// Mobile sidebar functions
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  sidebar.classList.toggle('show');
  overlay.classList.toggle('show');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  sidebar.classList.remove('show');
  overlay.classList.remove('show');
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Update stats every 30 seconds
  setInterval(updateStats, 30000);
  
  // Close sidebar when clicking nav links on mobile
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });
});