const socket = io();

/* eventos */
function updateProductList(products) {
    let productsDiv = document.getElementById("realtime-products");
    let productHTML = '';

    products.docs.forEach(product => {
        productHTML += `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div id="product-${product._id}" class="single-product">
                <div class="part-1">
                    <img src="${product.thumbnail}" alt="" class="product-image">
                    <ul>
                        <li><a href="#"><i class="fas fa-shopping-cart"></i></a></li>
                        <li><a href="#"><i class="fas fa-heart"></i></a></li>
                        <li><a href="#"><i class="fas fa-plus"></i></a></li>
                        <li><a href="#"><i class="fas fa-expand"></i></a></li>
                        <li><a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal" data-product-id="${product._id}"><i class="fas fa-trash"></i></a></li>

                    </ul>
                </div>
                <div class="part-2">
                    <h3 class="product-title">${product.title}</h3>
                    <h4 class="product-price">$${product.price}</h4>
                </div>
            </div>
        </div>`;
    });

    productsDiv.innerHTML = productHTML;
}

function submitProductForm(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let { title, status, category, description, price, thumbnail, code, stock } = Object.fromEntries(formData);

    status = status === "on" ? true : false;
    price = parseFloat(price);
    stock = parseInt(stock, 10);

    socket.emit("addProduct", title, status, category, description, price, thumbnail, code, stock);
}

function handleProductDeletion() {
    if (productIdToDelete) {
        socket.emit("deleteProduct", productIdToDelete);
        deleteModalInstance.hide();
    }
}

// Inicialización y Eventos de Sockets
socket.on("products", updateProductList);
socket.on("productsUpdated", (products) => {
    updateProductList(products);
    document.getElementById("productForm").reset();
});

socket.on("productNotification", (message) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    Toast.fire({
        icon: 'success',
        title: message
    });
});

socket.on("productsError", (text) => {
    let errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.textContent = text;
    errorMessageDiv.style.display = "block";
    setTimeout(() => {
        errorMessageDiv.style.display = "none";
    }, 3000);
});

// Eventos DOM
document.getElementById("productForm").addEventListener("submit", submitProductForm);
document.getElementById('confirmDelete').addEventListener('click', handleProductDeletion);

const deleteModal = document.getElementById('deleteModal');
const deleteModalInstance = new bootstrap.Modal(deleteModal);

let productIdToDelete;

// Cuando el modal de eliminar se muestra, guarda el ID del producto a eliminar.
deleteModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Botón que activó el modal
    productIdToDelete = button.getAttribute('data-product-id'); // Obtener el ID del producto desde el atributo data
});