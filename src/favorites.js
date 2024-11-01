let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorites found.</p>';
        return;
    }

    favorites.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-box');
        productDiv.innerHTML = `
            <img class="product-img" src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand}</p>
            <p>Type: ${product.product_type}</p>
            <p>Price: $${product.price}</p>
            <p><a href="${product.product_link}" target="_blank" class="view-product-link">View Product</a></p>
            <p id="desc-${index}">Description: ${product.description}</p>
            <p>Rating: ${product.rating}</p>
            <textarea id="note-${index}" placeholder="Add your note here..."></textarea>
            <button class="add-note" data-index='${index}'>Add Note</button>
            <button class="remove-from-favorites" data-index='${index}'>Remove</button>
            <div class="notes-container" id="notes-container-${index}"></div>
        `;
        favoritesList.appendChild(productDiv);

        // Display saved notes for this product
        displayNotes(index);
    });

    document.querySelectorAll('.add-note').forEach(button => {
        button.addEventListener('click', addNote);
    });

    document.querySelectorAll('.remove-from-favorites').forEach(button => {
        button.addEventListener('click', removeFromFavorites);
    });
}

function addNote(event) {
    const index = event.target.dataset.index;
    const noteInput = document.getElementById(`note-${index}`);
    const newNote = noteInput.value.trim();

    if (newNote) {
        favorites[index].notes = favorites[index].notes || [];
        favorites[index].notes.push(newNote); 
        localStorage.setItem('favorites', JSON.stringify(favorites)); 
        noteInput.value = ''; 
        displayFavorites();
    }
}

function removeFromFavorites(event) {
    const index = event.target.dataset.index;
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function displayNotes(index) {
    const notesContainer = document.getElementById(`notes-container-${index}`);
    notesContainer.innerHTML = '';

    const notes = favorites[index].notes || [];
    notes.forEach((note, noteIndex) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerText = note;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete Note';
        deleteBtn.classList.add('delete-note');
        deleteBtn.onclick = () => {
            deleteNote(index, noteIndex);
        };

        noteElement.appendChild(deleteBtn);
        notesContainer.appendChild(noteElement);
    });
}

function deleteNote(productIndex, noteIndex) {
    favorites[productIndex].notes.splice(noteIndex, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites)); 
    displayFavorites();
}

displayFavorites();