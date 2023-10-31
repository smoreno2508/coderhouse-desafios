function getCartIdFromCache() {
    return localStorage.getItem('cartId');
}

async function createNewCart() {
    const response = await fetch('/api/carts', { method: 'POST' });
    const data = await response.json();
    if (data.status === 'success') {
        localStorage.setItem('cartId', data.data._id);
        return data.data._id;
    } else {
        throw new Error('Failed to create cart.');
    }
}

async function addProductToCart(productId) {
    let cartId = getCartIdFromCache();
    
    const addToCartRequest = async (cartId) => {
        return fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });
                
                    Toast.fire({
                        icon: 'success',
                        title: `producto agregado al carrito`
                    });   
                } else {
                    throw new Error('Failed to add product to cart.');
                }
            });
    };

    if (cartId) {
        return await addToCartRequest(cartId);
    } else {
        return await createNewCart().then(newCartId => addToCartRequest(newCartId));
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Recuperar el ID del carrito de localStorage
    const cartId = localStorage.getItem('cartId');

    const cartLink = document.getElementById('cartLink');
    if(cartId) {
        cartLink.setAttribute('href', `/cart/${cartId}`);
    } else {
        cartLink.style.display = 'none'; 
    }
});

