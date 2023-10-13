document.addEventListener('DOMContentLoaded', () => {
  const deleteUserButton = document.getElementById('deleteUserButton');

  deleteUserButton.addEventListener('click', async () => {
    const userId = deleteUserButton.dataset.userId;

    try {
      const response = await fetch(`/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        req.session.destroy()
        window.location.href = '/login';  // Redirect to profile page after successful deletion
      } else {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'La suppression a échoué. Veuillez réessayer.';
        errorMessage.style.color = 'red';
      }
    } catch (error) {
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = 'Une erreur s\'est produite lors de la suppression : ' + error.message;
      errorMessage.style.color = 'red';
    }
  });
});