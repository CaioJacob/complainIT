document.addEventListener('DOMContentLoaded', loadComplaints);

function loadComplaints() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('User not logged in!');
        window.location.href = 'index.html';
        return;
    }

    fetch(`http://localhost:3000/api/complaints?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('complaintsTable').querySelector('tbody');
            tbody.innerHTML = data.complaints
                .map(complaint => `<tr><td>${complaint.id}</td><td>${complaint.text}</td></tr>`)
                .join('');
        })
        .catch(err => console.error('Error:', err));
}

function addComplaint() {
    const userId = localStorage.getItem('userId');
    const text = prompt('Enter your complaint:');
    if (!text) return;

    fetch('http://localhost:3000/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Complaint added successfully!');
                loadComplaints();
            }
        })
        .catch(err => console.error('Error:', err));
}
