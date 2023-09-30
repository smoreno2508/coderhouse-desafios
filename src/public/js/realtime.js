const socket = io();

socket.on("products", (products) => {
    updateProductList(products);
});

socket.on("productsUpdated", (products) => {
    updateProductList(products);
    // Limpiar el formulario después de enviar
    document.getElementById("productForm").reset();
});


socket.on("productAddedNotification", (message) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    Toast.fire({
        icon: 'success',
        title: message
    })
});

socket.on("productsError", (text) => {
    let errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.textContent = text;
    errorMessageDiv.style.display = "block";
    setTimeout(() => {
        errorMessageDiv.style.display = "none";
    }, 3000);
})

function updateProductList(products) {
    let productsDiv = document.getElementById("realtime-products");
    let productHTML = '';

    products.forEach(product => {
        productHTML += `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div id="product-${product.id}" class="single-product">
                <div class="part-1">
                     <img src="${product.thumbnail}" alt="" class="product-image">
                    <ul>
                        <li><a href="#"><i class="fas fa-shopping-cart"></i></a></li>
                        <li><a href="#"><i class="fas fa-heart"></i></a></li>
                        <li><a href="#"><i class="fas fa-plus"></i></a></li>
                        <li><a href="#"><i class="fas fa-expand"></i></a></li>
                        <li><a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal" data-product-id="${product.id}"><i class="fas fa-trash"></i></a></li>

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

// Obtener el botón de envío
let submitButton = document.querySelector("#productForm button[type='submit']");

document.getElementById("productForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let title = formData.get("title");
    let status = formData.get("status") === "on" ? true : false;
    let category = formData.get("category");
    let description = formData.get("description");
    let price = parseFloat(formData.get("price"));
    let thumbnail = formData.get("thumbnail");
    let code = formData.get("code");
    let stock = parseInt(formData.get("stock"), 10);


    socket.emit("addProduct", title, status, category, description, price, thumbnail, code, stock);
});



const deleteModal = document.getElementById('deleteModal');
const deleteModalInstance = new bootstrap.Modal(deleteModal);

let productIdToDelete;

// Cuando el modal de eliminar se muestra, guarda el ID del producto a eliminar.
deleteModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Botón que activó el modal
    productIdToDelete = button.getAttribute('data-product-id'); // Obtener el ID del producto desde el atributo data
});

// Cuando se confirma la eliminación
document.getElementById('confirmDelete').addEventListener('click', function () {
    if (productIdToDelete) {
        socket.emit("deleteProduct", productIdToDelete);
        deleteModalInstance.hide();
        document.body.classList.remove('modal-open');
        document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    }
});

