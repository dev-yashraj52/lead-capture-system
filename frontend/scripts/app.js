const leadModal = document.getElementById('leadModal');
const leadForm = document.getElementById('leadForm')
const closeModalButton = document.getElementById('closeModalBtn');
const addLeadBtn = document.getElementById('addLeadBtn');
const cancelBtn = document.getElementById('cancelBtn');

addLeadBtn.addEventListener('click', () => openModal());
closeModalButton.addEventListener('click', () => closeModal());

function openModal() {
    leadForm.reset();
    leadModal.style.display = "flex";
}

function closeModal() {
    leadModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == leadModal) closeModal();
}