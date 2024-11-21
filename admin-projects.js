document.addEventListener('DOMContentLoaded', function() {
    const addEventButton = document.getElementById('addEventButton');
    const modal = document.getElementById('eventModal');
    const closeModal = document.querySelector('.close-modal');
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const uploadedFiles = document.getElementById('uploadedFiles');
    const eventForm = document.getElementById('eventForm');

    // Load existing events when page loads
    loadEvents();

    // Show modal
    addEventButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        resetForm();
    });

    // Handle file selection and preview
    photoInput.addEventListener('change', function(e) {
        const files = e.target.files;
        photoPreview.innerHTML = '';
        uploadedFiles.innerHTML = '';

        const countDiv = document.createElement('div');
        countDiv.className = 'file-count';
        countDiv.textContent = `${files.length} file(s) selected`;
        uploadedFiles.appendChild(countDiv);

        Array.from(files).forEach(file => {
            // File name display
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-name';
            fileDiv.textContent = file.name;
            uploadedFiles.appendChild(fileDiv);

            // Image preview
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'preview-item';
                    previewDiv.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                    `;
                    photoPreview.appendChild(previewDiv);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Handle form submission
    eventForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('eventName', document.getElementById('eventName').value);
        
        // Append all selected files
        Array.from(photoInput.files).forEach(file => {
            formData.append('photos', file);
        });

        try {
            const response = await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const newEvent = await response.json();
            addEventToPage(newEvent);
            modal.style.display = 'none';
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload event. Please try again.');
        }
    });

    // Load existing events
    async function loadEvents() {
        try {
            const response = await fetch('http://localhost:3000/api/events');
            const events = await response.json();
            events.forEach(addEventToPage);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    // Add event to page
    function addEventToPage(event) {
        const newSection = document.createElement('section');
        newSection.className = 'project-section';
        newSection.dataset.eventId = event.id;
        
        newSection.innerHTML = `
            <div class="event-header">
                <h2>${event.name}</h2>
                <button class="remove-event-btn" data-event-id="${event.id}">Remove Event</button>
            </div>
            <div class="project-grid">
                ${event.photos.map(photo => `
                    <div class="project-card image-box">
                        <img src="http://localhost:3000${photo}" alt="${event.name}">
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handler for remove button
        const removeBtn = newSection.querySelector('.remove-event-btn');
        removeBtn.addEventListener('click', async function() {
            if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
                try {
                    console.log('Deleting event:', event.id); // Debug log

                    const response = await fetch(`http://localhost:3000/api/events/${event.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();
                    console.log('Server response:', data); // Debug log

                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to delete event');
                    }

                    // Add removing animation class
                    newSection.classList.add('removing');
                    
                    // Remove section after animation
                    setTimeout(() => {
                        newSection.remove();
                    }, 300);

                } catch (error) {
                    console.error('Delete error:', error);
                    alert(`Failed to delete event: ${error.message}`);
                }
            }
        });

        // Add the new section before future projects
        const futureProjects = document.getElementById('future-projects');
        if (futureProjects) {
            futureProjects.parentNode.insertBefore(newSection, futureProjects);
        } else {
            document.body.appendChild(newSection);
        }
    }

    function resetForm() {
        eventForm.reset();
        photoPreview.innerHTML = '';
        uploadedFiles.innerHTML = '';
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetForm();
        }
    });
});