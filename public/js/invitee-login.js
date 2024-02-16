// invitee-login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('invitee-login-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/invitee-login', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            
            const responseData = await response.json();
            console.log(responseData);
            
            // Redirect to main page or session page
            window.location.href = '/main-page.html'; // Replace 'main-page.html' with your actual main page URL
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    });
});
