let allProducts = [];

async function fetchProducts() {
    const response = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json');
    allProducts = await response.json();
    console.log(allProducts);
    populateFilters(allProducts);
    displayProducts(allProducts); 
}

function populateFilters(products) {
    const brandSelect = document.getElementById('brand-filter');
    const typeSelect = document.getElementById('type-filter');

    const brands = new Set();
    const types = new Set();

    products.forEach(product => {
        brands.add(product.brand);
        types.add(product.product_type);
    });

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
}

function filterProducts() {
    const brandFilter = document.getElementById('brand-filter');
    const typeFilter = document.getElementById('type-filter');

    const filteredProducts = allProducts.filter(product => {
        const brandMatch = brandFilter.value === '' || product.brand === brandFilter.value;
        const typeMatch = typeFilter.value === '' || product.product_type === typeFilter.value;
        return brandMatch && typeMatch;
    });

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>'; 
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-box'; 
        const description = product.description.split('.').slice(0, 5).join('.') + (product.product_link ? ` <a href="${product.product_link}" target="_blank" class="view-product-link">View Product</a>` : '');

        productDiv.innerHTML = `
            <img class="product-img" src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand}</p>
            <p>Type: ${product.product_type}</p>
            <p>Price: $${product.price}</p>
            <p>Description: ${description}</p>
            <p>Rating: ${product.rating}</p>
            <button class="add-to-favorites" data-product='${JSON.stringify(product)}'>Add to Favorites</button>
        `;
        productList.appendChild(productDiv);
    });

    const favoriteButtons = document.querySelectorAll('.add-to-favorites');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', addToFavorites);
    });
}

function addToFavorites(event) {
    const product = JSON.parse(event.target.getAttribute('data-product'));
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.some(fav => fav.id === product.id)) {
        favorites.push(product); 
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Product added to favorites!');
    } else {
        alert('Product is already in favorites!'); 
    }
}

document.getElementById('brand-filter').addEventListener('change', filterProducts);
document.getElementById('type-filter').addEventListener('change', filterProducts);

fetchProducts();