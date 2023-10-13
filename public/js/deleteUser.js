document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('deleteUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = '<%= user._id %>'; // Récupère l'ID de l'utilisateur
    try {
        const response = await fetch(`/user/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Redirige l'utilisateur vers la page d'accueil après la suppression
            window.location.href = '/';
        } else {
            console.error('La suppression a échoué.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression :', error);
    }
  });
});
