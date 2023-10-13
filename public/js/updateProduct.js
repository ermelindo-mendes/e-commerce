document.addEventListener('DOMContentLoaded', () => {
    const updateProductForm = document.getElementById('updateProductForm');
  
    updateProductForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const id = updateProductForm.dataset.productId;
      const name = document.getElementById('name').value;
      const category = document.getElementById('category').value;
      const description = document.getElementById('description').value;
      const image = document.getElementById('image').value;

  
      const data = {
        name,
        category,
        description,
        image,
      };
  
      try {
        const response = await fetch(`/products/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          window.location.href = '/products';
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
  