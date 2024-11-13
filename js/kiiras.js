document.getElementById('filter-form').addEventListener('submit', function (event) {
    event.preventDefault(); 
  
    const film = document.getElementById('film').value;
    const mozi = document.getElementById('mozi').value;
    const hely = document.getElementById('hely').value;
  
    
    fetch(`/api/adatok?film=${encodeURIComponent(film)}&mozi=${encodeURIComponent(mozi)}&hely=${encodeURIComponent(hely)}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('adatbazis-container');
            container.innerHTML = ''; 
  
           
            data.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `<strong>${item.hely}</strong> - Mozi ID: ${item.mozi} - Hely ID: ${item.hely}`;
                container.appendChild(div);
            });
        })
        .catch(error => console.error('Hiba:', error));
  });
  