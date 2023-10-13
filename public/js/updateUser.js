document.addEventListener('DOMContentLoaded', () => {
  const updateUserForm = document.getElementById('updateUserForm');

  updateUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = updateUserForm.dataset.userId;
    const lastname = document.getElementById('lastname').value;
    const firstname = document.getElementById('firstname').value;
    const username = document.getElementById('username').value;

    const data = {
      lastname,
      firstname,
      username,
    };

    try {
      const response = await fetch(`/user/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.location.href = '/profil';
      } else {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'La mise à jour a échoué. Veuillez réessayer.';
        errorMessage.style.color = 'red';
      }
    } catch (error) {
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = 'Une erreur s\'est produite lors de la mise à jour : ' + error.message;
      errorMessage.style.color = 'red';
    }
  });
});
