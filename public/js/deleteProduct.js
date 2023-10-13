// deleteProduct.js
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-product');
    // console.log(deleteButtons);
    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const productId = button.dataset.productId;
        // console.log(productId);
        try {
          const response = await fetch(`/products/delete/${productId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            // window.location.href = '/products';
          } else {
            window.location.reload();
          }
        } catch (error) {
          console.error('Erreur lors de la suppression du produit :', error);
        }
      });
    });
  });
  
  