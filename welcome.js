document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.login-btn');
    const modal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');

    loginBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.role === 'manager') {
                window.location.href = '/admin_panel.html';
            } else if (data.role === 'admin') {
                window.location.href = '/logs.html';
            } else {
                alert('Giriş başarısız!');
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            alert('Giriş yapılırken bir hata oluştu!');
        }
    });
});
