// Login form handling
document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const adminNo = document.getElementById('adminNo').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    const submitBtn = this.querySelector('.login-btn');
    submitBtn.textContent = 'Signing in...';
    submitBtn.classList.add('loading');
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
        if(adminNo === '1477' && password === '0000') {
            // Set login status in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            // Successful login
            window.location.href = 'admin-projects.html';
        } else {
            // Failed login
            alert('Invalid admin number or password. Please try again.');
            document.getElementById('password').value = '';
            
            // Reset button state
            submitBtn.textContent = 'Sign In';
            submitBtn.classList.remove('loading');
        }
    }, 500);
});

// Admin number input validation
document.getElementById('adminNo').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
}); 