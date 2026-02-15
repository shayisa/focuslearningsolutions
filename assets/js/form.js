/* ================================================================
   FORM.JS — Contact form validation and submission
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[data-validate]').forEach(initFormValidation);
});

function initFormValidation(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(form);

        const isValid = validateForm(form);
        if (isValid) {
            submitForm(form);
        }
    });

    // Real-time validation on blur
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let error = '';

    if (field.hasAttribute('required') && !value) {
        error = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        error = 'Please enter a valid email address';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        error = 'Please enter a valid phone number';
    }

    if (error) {
        showFieldError(field, error);
        return false;
    }
    clearFieldError(field);
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[+]?[\d\s()-]{7,20}$/.test(phone);
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#e53e3e';

    let errorEl = field.parentNode.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'color:#e53e3e;font-size:0.8rem;margin-top:4px;display:block';
        field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) errorEl.remove();
}

function clearErrors(form) {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('[style*="border-color"]').forEach(el => el.style.borderColor = '');
}

function submitForm(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    // Formspree or similar — replace action URL when ready
    const action = form.getAttribute('action');
    if (action && action.startsWith('https://')) {
        const formData = new FormData(form);
        fetch(action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                showSuccess(form);
            } else {
                showFormError(form, 'Something went wrong. Please try again or contact us directly.');
            }
        })
        .catch(() => {
            showFormError(form, 'Network error. Please try again or call us at 03-7612 9141.');
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    } else {
        // No action URL yet — show success message for demo
        setTimeout(() => {
            showSuccess(form);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }, 800);
    }
}

function showSuccess(form) {
    const msg = document.createElement('div');
    msg.className = 'form-success';
    msg.style.cssText = 'background:#e6f4f4;border:1px solid #0d7377;color:#0d7377;padding:16px 24px;border-radius:8px;margin-top:16px;font-weight:500;text-align:center';
    msg.innerHTML = '<strong>Thank you!</strong> Your message has been sent. We\'ll get back to you within 1 business day.';
    form.parentNode.insertBefore(msg, form.nextSibling);
    form.reset();

    setTimeout(() => msg.remove(), 8000);
}

function showFormError(form, message) {
    const msg = document.createElement('div');
    msg.className = 'form-error-msg';
    msg.style.cssText = 'background:#fff5f5;border:1px solid #e53e3e;color:#e53e3e;padding:16px 24px;border-radius:8px;margin-top:16px;font-weight:500;text-align:center';
    msg.textContent = message;
    form.parentNode.insertBefore(msg, form.nextSibling);

    setTimeout(() => msg.remove(), 8000);
}
