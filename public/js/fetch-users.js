// fetch-users.js

// تعریف تابعی برای دریافت اطلاعات کاربران از سرور
async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error('Unable to fetch users');
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// ارسال درخواست برای دریافت اطلاعات کاربران و نمایش آنها
fetchUsers()
    .then(users => {
        console.log('Users:', users);
        // در اینجا می‌توانید اطلاعات کاربران را به رابط کاربری خود منتقل کنید
    });
