document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('kapcsolatf');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = {
            name: formData.get('nev'),
            email: formData.get('email'),
            message: formData.get('uzenet')
        };
        fetch('/kapcsolat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
        })
        .catch(error => console.error('Error:', error));
    });
});