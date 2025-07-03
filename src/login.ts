const form = document.querySelector<HTMLFormElement>('#login-form')!;
const loginInput = document.querySelector<HTMLInputElement>('#login')!;
const passwordInput = document.querySelector<HTMLInputElement>('#password')!;
const errorMsg = document.querySelector<HTMLParagraphElement>('#error-message')!;

form.onsubmit = async (e) => {
  e.preventDefault();

  const credentials = {
    login: loginInput.value,
    password: passwordInput.value
  };

  console.log("Dane logowania: ", credentials)

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!res.ok) {
      throw new Error('Nieprawidłowy login lub hasło');
    }

    const data = await res.json();

    console.log("Odpowiedź z serwera: ", data)

    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    window.location.href = '/index.html';
    
  } catch (err) {
    errorMsg.textContent = (err as Error).message;
  }
};
