window.addEventListener('DOMContentLoaded', (event) => {
    fetch('/uzenetek')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('uzenetek-container');
            container.innerHTML = '';
            data.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `<strong>${item.name}</strong> - ${item.email} - ${item.message} - ${item.created_at}`;
                container.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
});
