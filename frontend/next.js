function toggleNextButton() {
    const checkboxes = document.querySelectorAll('.checkbox');
    const nextButton = document.getElementById('next-button');
    const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    // Show or hide the "Next" button based on selection
    if (isChecked) {
        nextButton.style.display = 'block';
    } else {
        nextButton.style.display = 'none';
    }
}

function navigateToNext() {
    // Logic to navigate to the next page (e.g., reg.html)
    window.location.href = 'reg.html'; // Update the target page if needed
}
