// در فایل script.js

// تابعی برای اضافه کردن یک کاربر به لیست
function addUserToList(user) {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const img = document.createElement('img');
    img.src = user.avatarUrl;
    const userInfo = document.createElement('span');
    userInfo.innerText = `${user.firstName} ${user.lastName}`;
    li.appendChild(img);
    li.appendChild(userInfo);
    userList.appendChild(li);
}

// فرض کنید که اطلاعات کاربران از سمت سرور دریافت شده است
const users = [
    { firstName: 'John', lastName: 'Doe', avatarUrl: '/client/img/Admin.png' },
    { firstName: 'Jane', lastName: 'Smith', avatarUrl: '/client/img/Admin.png' },
    // داده‌های بیشتر اینجا قرار می‌گیرند
];

// اضافه کردن هر کاربر به لیست
users.forEach(user => addUserToList(user));

// در فایل script.js

const muteAudioBtn = document.getElementById('mute-audio-btn');
const unmuteAudioBtn = document.getElementById('unmute-audio-btn');
const muteVideoBtn = document.getElementById('mute-video-btn');
const unmuteVideoBtn = document.getElementById('unmute-video-btn');

// وضعیت اولیه دکمه‌ها
unmuteAudioBtn.disabled = true;
unmuteVideoBtn.disabled = true;

// رویدادهای کلیک برای دکمه‌ها
muteAudioBtn.addEventListener('click', () => {
    // کد برای خاموش کردن صدا
    muteAudioBtn.disabled = true;
    unmuteAudioBtn.disabled = false;
});

unmuteAudioBtn.addEventListener('click', () => {
    // کد برای روشن کردن صدا
    muteAudioBtn.disabled = false;
    unmuteAudioBtn.disabled = true;
});

muteVideoBtn.addEventListener('click', () => {
    // کد برای خاموش کردن تصویر
    muteVideoBtn.disabled = true;
    unmuteVideoBtn.disabled = false;
});

unmuteVideoBtn.addEventListener('click', () => {
    // کد برای روشن کردن تصویر
    muteVideoBtn.disabled = false;
    unmuteVideoBtn.disabled = true;
});


// در فایل script.js

const userNameSpan = document.getElementById('user-name');
const userCitySpan = document.getElementById('user-city');
const userOrgSpan = document.getElementById('user-org');

// فرض کنید که اطلاعات کاربر از سمت سرور دریافت شده است
const user = {
    name: 'John Doe',
    city: 'New York',
    organization: 'XYZ Inc.',
};

// نمایش اطلاعات در المان‌های مورد نظر
userNameSpan.innerText = user.name;
userCitySpan.innerText = user.city;
userOrgSpan.innerText = user.organization;


// در فایل script.js

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

loginBtn.addEventListener('click', () => {
    // کد برای ورود کاربر
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
});

logoutBtn.addEventListener('click', () => {
    // کد برای خروج کاربر
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
});



// در فایل script.js

const userAvatar = document.getElementById('user-avatar');

// تابع برای تغییر تصویر به وضعیت دوربین و میکروفون
function updateAvatar(cameraOn, microphoneOn) {
    if (cameraOn && microphoneOn) {
        userAvatar.src = "user-avatar-active.png";
    } else if (cameraOn && !microphoneOn) {
        userAvatar.src = "user-avatar-camera-only.png";
    } else if (!cameraOn && microphoneOn) {
        userAvatar.src = "user-avatar-microphone-only.png";
    } else {
        userAvatar.src = "user-avatar-inactive.png";
    }
}

// فرض کنید مقادیر cameraOn و microphoneOn از جای دیگری تامین می‌شوند
// به عنوان مثال، از ویدئوکنفرانس API
const cameraOn = true;
const microphoneOn = true;

// فراخوانی تابع برای تنظیم تصویر
updateAvatar(cameraOn, microphoneOn);
