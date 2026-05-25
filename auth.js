// Конфигурация API сервиса авторизации
const AUTH_API_URL = 'https://api.yourauthservice.com'; // Замените на ваш URL

// Элементы форм
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Обработка формы входа
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        try {
            const response = await fetch(`${AUTH_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка входа');
            }

            const data = await response.json();
            
            // Сохранение токена
            if (remember) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                sessionStorage.setItem('authToken', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }

            // Перенаправление на главную страницу чата
            window.location.href = 'index.html';
            
        } catch (error) {
            alert(`Ошибка входа: ${error.message}`);
            console.error('Login error:', error);
        }
    });
}

// Обработка формы регистрации
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.querySelector('input[name="terms"]').checked;

        // Валидация паролей
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        // Валидация условий
        if (!terms) {
            alert('Необходимо принять условия использования');
            return;
        }

        try {
            const response = await fetch(`${AUTH_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка регистрации');
            }

            const data = await response.json();
            
            // Автоматический вход после регистрации
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Перенаправление на главную страницу чата
            window.location.href = 'index.html';
            
        } catch (error) {
            alert(`Ошибка регистрации: ${error.message}`);
            console.error('Register error:', error);
        }
    });
}

// Проверка авторизации при загрузке страницы
function checkAuth() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (token && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'index.html';
    }
    
    return token;
}

// Функция выхода из системы
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Инициализация
checkAuth();
