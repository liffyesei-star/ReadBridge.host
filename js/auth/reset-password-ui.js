import { forgotPassword, resetPassword } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
    const form       = document.getElementById('reset-form');
    const errorBox   = document.getElementById('reset-error');
    const errorText  = document.getElementById('reset-error-text');
    const btnText    = document.getElementById('reset-btn-text');
    const spinner    = document.getElementById('reset-spinner');
    const successBox = document.getElementById('reset-success');
    const backLink   = document.getElementById('back-link');
    const resetEmail = document.getElementById('resetEmail');

    if (!form) return; // not on reset-password.html

    function showError(msg) {
        if (!errorText) return;
        errorText.textContent = msg;
        if (errorBox) errorBox.classList.remove('hidden');
    }

    function hideError() {
        if (errorBox) errorBox.classList.add('hidden');
        if (errorText) errorText.textContent = '';
    }

    function setLoading(loading) {
        if (loading) {
            if (btnText) btnText.textContent = 'Mengirim...';
            if (spinner) spinner.classList.remove('hidden');
            const btn = document.getElementById('reset-btn');
            if (btn) btn.disabled = true;
        } else {
            if (btnText) btnText.textContent = 'Kirim Tautan Reset';
            if (spinner) spinner.classList.add('hidden');
            const btn = document.getElementById('reset-btn');
            if (btn) btn.disabled = false;
        }
    }

    function showResetPasswordForm(token) {
        // Change UI for the new password form
        form.innerHTML = `
            <div class="flex flex-col gap-2">
                <label class="text-[14px] font-medium text-on-surface" for="newPassword">Kata Sandi Baru</label>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                    <input required type="password" class="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" id="newPassword" placeholder="Masukkan kata sandi baru (minimal 8 karakter)"/>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-[14px] font-medium text-on-surface" for="confirmPassword">Konfirmasi Kata Sandi</label>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock_check</span>
                    <input required type="password" class="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" id="confirmPassword" placeholder="Konfirmasi kata sandi baru"/>
                </div>
            </div>

            <div id="reset-error-inner" class="hidden flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[14px]">
                <span class="material-symbols-outlined text-[18px]">error</span>
                <span id="reset-error-text-inner"></span>
            </div>
            
            <button id="reset-btn-inner" class="w-full mt-2 px-8 py-3.5 bg-primary text-on-primary font-medium rounded-full hover:bg-primary/90 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2" type="submit">
                <span id="reset-btn-text-inner">Atur Ulang Kata Sandi</span>
                <span id="reset-spinner-inner" class="hidden w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            </button>
        `;

        document.getElementById('reset-title').textContent = 'Atur Ulang Kata Sandi';
        document.getElementById('reset-desc').textContent = 'Masukkan kata sandi baru Anda di bawah ini. Kata sandi harus minimal 8 karakter dengan kombinasi huruf dan angka.';

        const innerErrorBox = document.getElementById('reset-error-inner');
        const innerErrorText = document.getElementById('reset-error-text-inner');
        const innerBtn = document.getElementById('reset-btn-inner');
        const innerBtnText = document.getElementById('reset-btn-text-inner');
        const innerSpinner = document.getElementById('reset-spinner-inner');

        const showInnerError = (msg) => {
            innerErrorText.textContent = msg;
            innerErrorBox.classList.remove('hidden');
        };

        const hideInnerError = () => {
            innerErrorBox.classList.add('hidden');
            innerErrorText.textContent = '';
        };

        const setInnerLoading = (loading) => {
            if (loading) {
                innerBtnText.textContent = 'Memproses...';
                innerSpinner.classList.remove('hidden');
                innerBtn.disabled = true;
            } else {
                innerBtnText.textContent = 'Atur Ulang Kata Sandi';
                innerSpinner.classList.add('hidden');
                innerBtn.disabled = false;
            }
        };

        const newForm = document.getElementById('reset-form');
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideInnerError();

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                showInnerError('Kata sandi tidak cocok. Silakan coba lagi.');
                return;
            }

            if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
                showInnerError('Kata sandi minimal 8 karakter dan harus mengandung huruf serta angka.');
                return;
            }

            setInnerLoading(true);

            try {
                const data = await resetPassword(token, newPassword);

                if (!data.success) {
                    setInnerLoading(false);
                    showInnerError(data.message || 'Gagal mengatur ulang kata sandi');
                    return;
                }

                // Sukses
                newForm.classList.add('hidden');
                document.getElementById('reset-icon').classList.add('hidden');
                document.getElementById('reset-title').classList.add('hidden');
                document.getElementById('reset-desc').classList.add('hidden');
                if (backLink) backLink.classList.add('hidden');

                document.getElementById('success-email-msg').textContent = `Kata sandi Anda berhasil diatur ulang! Silakan login dengan kata sandi baru Anda.`;
                if (successBox) successBox.classList.remove('hidden');

            } catch (error) {
                setInnerLoading(false);
                showInnerError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
                console.error('Reset password error:', error);
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        // This is for forgot-password
        e.preventDefault();
        hideError();

        const email = resetEmail.value.trim();

        if (!email) {
            showError('Email harus diisi');
            return;
        }

        setLoading(true);

        try {
            const data = await forgotPassword(email);

            if (!data.success) {
                setLoading(false);
                showError(data.message || 'Gagal memproses. Silakan coba lagi.');
                return;
            }

            form.classList.add('hidden');
            document.getElementById('reset-icon').classList.add('hidden');
            document.getElementById('reset-title').classList.add('hidden');
            document.getElementById('reset-desc').classList.add('hidden');
            if (backLink) backLink.classList.add('hidden');

            document.getElementById('success-email-msg').textContent = `Jika email terdaftar di ReadBridge, tautan reset kata sandi akan dikirim. Silakan cek kotak masuk (atau folder spam) email Anda.`;
            if (successBox) successBox.classList.remove('hidden');

        } catch (error) {
            setLoading(false);
            showError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
            console.error('Forgot password error:', error);
        }
    });

    const checkResetTokenInURL = () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            showResetPasswordForm(token);
        }
    };

    checkResetTokenInURL();
});
