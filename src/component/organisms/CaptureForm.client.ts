const form = document.querySelector('#capture-form');
const successMessage = document.querySelector('#capture-form-success');
const errorMessage = document.querySelector('#capture-form-error');
const submitButton = form?.querySelector('button[type="submit"]');
const celularInput = document.querySelector('input[name="celular"]');

if (celularInput instanceof HTMLInputElement) {
  celularInput.addEventListener('input', () => {
    celularInput.value = celularInput.value.replace(/\D/g, '');
  });
}

if (
  form instanceof HTMLFormElement &&
  successMessage instanceof HTMLElement &&
  errorMessage instanceof HTMLElement &&
  submitButton instanceof HTMLButtonElement
) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    errorMessage.classList.add('hidden');

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => {
      if (!(field instanceof HTMLInputElement)) return;

      const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
      const value = field.value.trim();

      if (!value) {
        isValid = false;
        if (errorEl) {
          errorEl.classList.remove('hidden');
          errorEl.textContent = 'Este campo es obligatorio.';
        }
        return;
      }

      if (field.name === 'celular' && !/^3\d{9}$/.test(value)) {
        isValid = false;
        if (errorEl) {
          errorEl.classList.remove('hidden');
          errorEl.textContent = 'Ingresa un número de celular válido (10 dígitos, inicia en 3).';
        }
        return;
      }

      if (errorEl) errorEl.classList.add('hidden');
    });

    if (!isValid) return;

    const formData = new FormData(form);
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
      const response = await fetch(import.meta.env.PUBLIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          email: formData.get('email'),
          phone: formData.get('celular'),
          name: formData.get('nombre'),
          platform: import.meta.env.PUBLIC_PLATFORM_NAME,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      successMessage.classList.remove('hidden');
      form.reset();
    } catch {
      errorMessage.classList.remove('hidden');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
