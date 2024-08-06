const login = async (email, password) => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include credentials (cookies)
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (error) {
    if (error.name === 'TypeError') {
      console.log('Network error:', error.message);
    } else {
      console.log('Fetch error:', error.message);
    }
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log(email, password);
  

  login( email, password );
});
