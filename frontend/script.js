document
  .getElementById('waitlistForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = e.target.querySelector('input').value;

    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const result = await response.json();

    alert(result.message || result.error);
    e.target.reset();
  });
