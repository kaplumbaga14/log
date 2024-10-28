$(document).ready(function() {
    const managerCredentials = [
        {
            username: 'kaplumbaga',
            password: '1234',
            name: 'Lider'
        },
        {
            username: 'BaskanTaha',
            password: '12345',
            name: 'Kurucu'
        },
        {
            username: 'Emircan',
            password: '123456',
            name: 'Kurucu'
        }
    ];

    managerCredentials.forEach((manager, index) => {
        localStorage.setItem(`managerUsername${index}`, manager.username);
        localStorage.setItem(`managerPassword${index}`, manager.password);
        localStorage.setItem(`managerName${index}`, manager.name);
    });

    $('#managerLoginBtn').click(function() {
        $('#loginModal').show();
    });    

    $('#loginForm').submit(function(e) {
        e.preventDefault();
        let inputUsername = $('#adminUsername').val();
        let inputPassword = $('#adminPassword').val();
        
        let isValidManager = false;
        for(let i = 0; i < managerCredentials.length; i++) {
            if(inputUsername === localStorage.getItem(`managerUsername${i}`) &&
               inputPassword === localStorage.getItem(`managerPassword${i}`)) {
                isValidManager = true;
                $('#loginModal').hide();
                $('#managerLoginBtn').hide();
                $('#adminPanel').show();
                $('.admin-name').text(localStorage.getItem(`managerName${i}`));
                break;
            }
        }
        
        if(!isValidManager) {
            alert('Hatalı kullanıcı adı veya şifre!');
        }
    });

    $('.logout-btn').click(function() {
        $('#managerLoginBtn').show();
        $('#adminPanel').hide();
        $('#loginForm')[0].reset();
    });

    $(window).click(function(e) {
        if ($(e.target).hasClass('modal')) {
            $('.modal').hide();
        }
    });

    $('.menu-items a').click(function(e) {
        if (!$(this).attr('download')) {
            e.preventDefault();
            const page = $(this).data('page');
            
            $('.menu-items li').removeClass('active');
            $(this).parent().addClass('active');
            
            updatePageTitle(page);
            
            $('.log-section').removeClass('active');
            $(`#${page}-logs`).addClass('active');
            
            loadPageData(page);
        }
    });

    function updatePageTitle(page) {
        const titles = {
            'chat': 'AWP Chat Logs',
            'bans': 'Ban Kayıtları',
            'kicks': 'Kick Kayıtları',
            'mutes': 'Mute/Gag Kayıtları'
        };
        $('#page-title').text(titles[page]);
    }

    function loadPageData(page) {
        $.ajax({
            url: `api/get_${page}.php`,
            method: 'GET',
            data: {
                timeFilter: $('#timeFilter').val(),
                search: $('#search').val()
            },
            success: function(data) {
                updatePageContent(page, data);
            }
        });
    }

    function updatePageContent(page, data) {
        const container = $(`#${page}-logs`);
        if (page === 'chat') {
            const chatContainer = container.find('.chat-container');
            chatContainer.empty();
            data.forEach(msg => {
                chatContainer.append(`
                    <div class="chat-message">
                        <span class="time">[${msg.timestamp}]</span>
                        <span class="player">${msg.player}:</span>
                        <span class="message">${msg.message}</span>
                    </div>
                `);
            });
        } else {
            const tbody = container.find('tbody');
            tbody.empty();
            data.forEach(log => {
                let row = '<tr>';
                Object.values(log).forEach(value => {
                    row += `<td>${value}</td>`;
                });
                row += '</tr>';
                tbody.append(row);
            });
        }
    }

    $('#refreshBtn').click(function() {
        const activePage = $('.menu-items li.active a').data('page');
        loadPageData(activePage);
    });

    $('#search, #timeFilter').on('change keyup', function() {
        const activePage = $('.menu-items li.active a').data('page');
        loadPageData(activePage);
    });
});

function loadPageData(page) {
    $.ajax({
        url: `http://localhost:5501/api/get_${page}`,
        method: 'GET',
        data: {
            timeFilter: $('#timeFilter').val(),
            search: $('#search').val()
        },
        success: function(data) {
            updatePageContent(page, data);
        }
    });
}

function updatePageContent(page, data) {
    const container = $(`#${page}-logs`);
    if (page === 'chat') {
        const chatContainer = container.find('.chat-container');
        chatContainer.empty();
        data.forEach(msg => {
            chatContainer.append(`
                <div class="chat-message">
                    <span class="time">[${msg.Timestamp}]</span>
                    <span class="player">${msg.Player}:</span>
                    <span class="message">${msg.Message}</span>
                </div>
            `);
        });
    } else {
        const tbody = container.find('tbody');
        tbody.empty();
        data.forEach(log => {
            let row = '<tr>';
            if (page === 'bans') {
                row += `
                    <td>${log.Timestamp}</td>
                    <td>${log.Admin}</td>
                    <td>${log.Target}</td>
                    <td>${log.Duration}</td>
                    <td>${log.Reason}</td>
                `;
            } else if (page === 'kicks') {
                row += `
                    <td>${log.Timestamp}</td>
                    <td>${log.Admin}</td>
                    <td>${log.Target}</td>
                    <td>${log.Reason}</td>
                `;
            } else if (page === 'mutes') {
                row += `
                    <td>${log.Timestamp}</td>
                    <td>${log.Type}</td>
                    <td>${log.Admin}</td>
                    <td>${log.Target}</td>
                    <td>${log.Duration}</td>
                    <td>${log.Reason || 'N/A'}</td>
                `;
            }
            row += '</tr>';
            tbody.append(row);
        });
    }
}