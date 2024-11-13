document.getElementById('show-create-form').addEventListener('click', function() {
    const createFormContainer = document.getElementById('create-form-container');
    createFormContainer.style.display = createFormContainer.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('create-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const nev = document.getElementById('create-nev').value;
    const mozi = document.getElementById('create-mozi').value;
    const film = document.getElementById('create-film').value;
    const hely = document.getElementById('create-hely').value;

    fetch('/api/foglalas', {
        method: 'POST',
        body: JSON.stringify({ nev, mozi, film, hely }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error saving data');
        }
        return response.text();
    })
    .then(result => {
        alert('Adat sikeresen mentve');
        fetchFoglalas(); 
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('read-button').addEventListener('click', function() {
    const readContainer = document.getElementById('read-container');
    if (readContainer.style.display === 'none' || readContainer.style.display === '') {
        fetchFoglalas();
        readContainer.style.display = 'block';
    } else {
        readContainer.style.display = 'none';
    }
});

function fetchFoglalas() {
    fetch('/api/foglalas')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('read-container');
            container.innerHTML = '';
            data.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${item.nev}</strong> - Mozi: ${item.mozi_nev} - Film: ${item.film} - Hely: ${item.hely}
                    <div>
                        <button onclick="editFoglalas(${item.id})">Módosítás</button>
                        <button onclick="deleteFoglalas(${item.id})">Törlés</button>
                    </div>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
}

function deleteFoglalas(id) {
    fetch(`/api/foglalas/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting data');
        }
        return response.text();
    })
    .then(result => {
        alert('Adat sikeresen törölve');
        fetchFoglalas();
    })
    .catch(error => console.error('Error:', error));
}

function editFoglalas(id) {
    fetch(`/api/foglalas`)
        .then(response => response.json())
        .then(data => {
            const foglalas = data.find(item => item.id === id);
            document.getElementById('update-id').value = foglalas.id;
            document.getElementById('update-nev').value = foglalas.nev;
            document.getElementById('update-mozi').value = foglalas.mozi;
            document.getElementById('update-film').value = foglalas.film;
            document.getElementById('update-hely').value = foglalas.hely;

            document.getElementById('create-form-container').style.display = 'none';
            document.getElementById('update-form-container').style.display = 'block';
            document.getElementById('delete-form-container').style.display = 'none';
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('update-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('update-id').value;
    const nev = document.getElementById('update-nev').value;
    const mozi = document.getElementById('update-mozi').value;
    const film = document.getElementById('update-film').value;
    const hely = document.getElementById('update-hely').value;

    fetch(`/api/foglalas/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nev, mozi, film, hely }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error updating data');
        }
        return response.text();
    })
    .then(result => {
        alert('Adat sikeresen módosítva');
        fetchFoglalas();
    })
    .catch(error => console.error('Error:', error));
});


window.addEventListener('DOMContentLoaded', fetchFoglalas);
