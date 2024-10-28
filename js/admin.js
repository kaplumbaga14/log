document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showAddAdminForm').addEventListener('click', () => {
        const formContainer = document.getElementById('addAdminFormContainer');
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('addAdminForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('newAdminUsername').value;
        const password = document.getElementById('newAdminPassword').value;
        
        try {
            const response = await fetch('/api/admin/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    role: 'admin'
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Admin başarıyla eklendi!');
                document.getElementById('addAdminForm').reset();
                document.getElementById('addAdminFormContainer').style.display = 'none';
                loadAdminList();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            alert('Hata: ' + error.message);
        }
    });

    document.getElementById('adminSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const adminItems = document.querySelectorAll('.admin-item');
        
        adminItems.forEach(item => {
            const adminName = item.querySelector('span').textContent.toLowerCase();
            item.style.display = adminName.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    async function loadAdminList() {
        try {
            const response = await fetch('/api/admin/list');
            const admins = await response.json();
            
            const adminList = document.getElementById('adminList');
            adminList.innerHTML = '';
            
            admins.forEach(admin => {
                const adminDiv = document.createElement('div');
                adminDiv.className = 'admin-item';
                adminDiv.innerHTML = `
                    <span>${admin.username} (${admin.role})</span>
                    <button onclick="deleteAdmin('${admin.username}')" class="delete-btn">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                `;
                adminList.appendChild(adminDiv);
            });
        } catch (error) {
            console.error('Admin listesi yüklenirken hata:', error);
        }
    }

    loadAdminList();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
            window.location.href = '/welcome.html';
        }
    });
});

function deleteAdmin(username) {
    if (confirm(`${username} kullanıcısını silmek istediğinize emin misiniz?`)) {
        fetch(`/api/admin/delete/${username}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Admin başarıyla silindi!');
            location.reload();
        })
        .catch(error => {
            alert('Hata: ' + error.message);
        });
    }
}
