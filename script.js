document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle (jika digunakan pada dashboard)
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      document.querySelector('.main-content')?.classList.toggle('active');
    });
  }
  
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  }
  
  // Muat data pengguna (jika ada)
  loadUserData();
  
  // Buat captcha sederhana di halaman register (jika elemen tersedia)
  if (document.getElementById('randomNumber')) {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 4 digit
    document.getElementById('randomNumber').textContent = randomNumber;
    localStorage.setItem('verificationNumber', randomNumber);
  }
  
  // Toggle password (untuk form login & register)
  const toggleIcons = document.querySelectorAll('.toggle-password');
  toggleIcons.forEach(icon => {
    icon.addEventListener('click', togglePassword);
  });

  // Dark mode toggle (jika ada switch dengan id modeToggle)
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    if (localStorage.getItem('mode') === 'dark') {
      document.body.classList.add('dark-mode');
      modeToggle.checked = true;
    }
  }

  // -- Simulasi form login lokal (jika diperlukan) --
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'home.html';
      } else {
        alert('Email atau password salah!');
      }
    });
  }
  
  // -- Simulasi form registrasi lokal (jika diperlukan) --
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const birthplace = document.getElementById('birthplace').value;
      const birthdate = document.getElementById('birthdate').value;
      const verificationInput = document.getElementById('verification').value;
      const storedVerification = localStorage.getItem('verificationNumber');
      
      if (verificationInput !== storedVerification) {
        alert('Verifikasi angka tidak cocok!');
        return;
      }
      
      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.some(u => u.email === email)) {
        alert('Email sudah terdaftar!');
        return;
      }
      
      const newUser = {
        id: Date.now(),
        name: fullname,
        email: email,
        password: password,
        birthPlace: birthplace,
        birthDate: birthdate,
        profilePic: 'assets/default-avatar.png'
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Pendaftaran berhasil! Silakan login.');
      window.location.href = 'login.html';
    });
  }
  
  // -- Form lupa password --
  const forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email);
      if (user) {
        alert('Instruksi reset password telah dikirim ke email Anda (simulasi).');
      } else {
        alert('Email tidak ditemukan!');
      }
    });
  }
  
  // -- Form ganti password --
  const changePasswordForm = document.getElementById('changePasswordForm');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.password === currentPassword) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.map(u => {
          if (u.email === currentUser.email) {
            u.password = newPassword;
            currentUser.password = newPassword;
          }
          return u;
        });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Password berhasil diubah!');
      } else {
        alert('Password saat ini salah!');
      }
    });
  }
  
  // -- Form edit data akun --
  const editAccountForm = document.getElementById('editAccountForm');
  if (editAccountForm) {
    editAccountForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const editName = document.getElementById('editName').value;
      const editBirthplace = document.getElementById('editBirthplace').value;
      const editBirthdate = document.getElementById('editBirthdate').value;
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        currentUser.name = editName;
        currentUser.birthPlace = editBirthplace;
        currentUser.birthDate = editBirthdate;
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.map(u => u.email === currentUser.email ? currentUser : u);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Data akun berhasil diperbarui!');
        loadUserData();
      }
    });
  }
  
  // -- Upload foto profil --
  const uploadProfilePic = document.getElementById('uploadProfilePic');
  if (uploadProfilePic) {
    uploadProfilePic.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          let currentUser = JSON.parse(localStorage.getItem('currentUser'));
          currentUser.profilePic = e.target.result;
          let users = JSON.parse(localStorage.getItem('users')) || [];
          users = users.map(u => u.email === currentUser.email ? currentUser : u);
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          document.getElementById('profilePic').src = e.target.result;
          document.getElementById('accountProfilePic').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // -- Muat Renungan Harian (devotion.html) --
  if (document.getElementById('devotionList')) {
    let devotions = JSON.parse(localStorage.getItem('devotions'));
    if (!devotions) {
      devotions = [
        {
          date: "2023-03-01",
          title: "Renungan Harian 1",
          content: "Hari ini mari kita merenungkan kasih Tuhan yang abadi."
        },
        {
          date: "2023-03-02",
          title: "Renungan Harian 2",
          content: "Dalam setiap tantangan, Tuhan selalu menyertai kita."
        }
      ];
      localStorage.setItem('devotions', JSON.stringify(devotions));
    }
    loadDevotions();
  }
  
  // -- Form upload renungan --
  const uploadDevotionForm = document.getElementById('uploadDevotionForm');
  if (uploadDevotionForm) {
    uploadDevotionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('devotionTitle').value;
      const date = document.getElementById('devotionDate').value;
      const content = document.getElementById('devotionContent').value;
      const imageInput = document.getElementById('devotionImage');
      
      let imageData = "";
      if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imageData = e.target.result;
          saveDevotion(title, date, content, imageData);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        saveDevotion(title, date, content, imageData);
      }
    });
  }
  
  // -- Mode Gelap/Terang --
  const modeToggleSwitch = document.getElementById('modeToggle');
  if (modeToggleSwitch) {
    modeToggleSwitch.addEventListener('change', toggleMode);
  }
});

function saveDevotion(title, date, content, imageData) {
  let devotions = JSON.parse(localStorage.getItem('devotions')) || [];
  const newDevotion = {
    title,
    date,
    content,
    image: imageData
  };
  devotions.push(newDevotion);
  localStorage.setItem('devotions', JSON.stringify(devotions));
  alert('Renungan berhasil diunggah!');
  loadDevotions();
  document.getElementById('uploadDevotionForm').reset();
}

function loadDevotions() {
  const devotionList = document.getElementById('devotionList');
  devotionList.innerHTML = "";
  let devotions = JSON.parse(localStorage.getItem('devotions')) || [];
  devotions.forEach(devotion => {
    const item = document.createElement('div');
    item.className = 'devotion-item';
    let imageHTML = "";
    if (devotion.image) {
      imageHTML = `<img src="${devotion.image}" alt="${devotion.title}" style="max-width:100%; margin-bottom:10px;">`;
    }
    item.innerHTML = `<h3>${devotion.title}</h3>
                      <small>${devotion.date}</small>
                      ${imageHTML}
                      <p>${devotion.content}</p>`;
    devotionList.appendChild(item);
  });
}

function togglePassword() {
  const passwordField = document.getElementById('password');
  const toggleIcon = document.querySelector('.toggle-password');
  if (passwordField) {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      toggleIcon.src = 'assets/eye-close.png';
    } else {
      passwordField.type = 'password';
      toggleIcon.src = 'assets/eye-open.png';
    }
  }
}

function toggleMode() {
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('mode', 'light');
  }
}

function loadUserData() {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    const profilePicElems = document.querySelectorAll('#profilePic, #accountProfilePic');
    profilePicElems.forEach(elem => {
      elem.src = currentUser.profilePic;
    });
    const userNameElems = document.querySelectorAll('#userName, #accountName');
    userNameElems.forEach(elem => {
      elem.textContent = currentUser.name;
    });
    const userEmailElems = document.querySelectorAll('#userEmail, #accountEmail');
    userEmailElems.forEach(elem => {
      elem.textContent = currentUser.email;
    });
    if (document.getElementById('accountBirthplace')) {
      document.getElementById('accountBirthplace').textContent = currentUser.birthPlace || "";
    }
    if (document.getElementById('accountBirthdate')) {
      document.getElementById('accountBirthdate').textContent = currentUser.birthDate || "";
    }
    // Isi form edit (jika ada)
    if (document.getElementById('editName')) {
      document.getElementById('editName').value = currentUser.name;
    }
    if (document.getElementById('editBirthplace')) {
      document.getElementById('editBirthplace').value = currentUser.birthPlace || "";
    }
    if (document.getElementById('editBirthdate')) {
      document.getElementById('editBirthdate').value = currentUser.birthDate || "";
    }
  }
}
