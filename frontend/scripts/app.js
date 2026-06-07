import * as API from './api_calls.js'

const leadModal = document.getElementById('leadModal');
const leadForm = document.getElementById('leadForm')
const closeModalButton = document.getElementById('closeModalBtn');
const addLeadBtn = document.getElementById('addLeadBtn');
const cancelBtn = document.getElementById('cancelBtn');
const leadsTable = document.getElementById('leadsTable');
const noLeadsMessage = document.getElementById('noLeadsMessage');
const leadsTableBody = document.getElementById('leadsTableBody');

//Form References
const nameInput = document.getElementById('leadName');
const emailInput = document.getElementById('leadEmail');
const mobileInput = document.getElementById('leadMobile');
const companyInput = document.getElementById('leadCompany');
const sourceInput = document.getElementById('leadSource');
const statusInput = document.getElementById('leadStatus');

document.addEventListener('DOMContentLoaded', renderLeads);
addLeadBtn.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
leadForm.addEventListener('submit', handleFormSubmit)

function openModal() {
    clearValidationErrors();
    leadForm.reset();
    leadModal.style.display = "flex";
}

function closeModal() {
    leadModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == leadModal) closeModal();
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const leadData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        mobile: mobileInput.value.trim(),
        company: companyInput.value.trim(),
        status: statusInput.value
    }

    saveNewLead(leadData);

}

function validateForm() {
    let isValid = true;
    clearValidationErrors();

    if (!nameInput.value.trim()) {
        showError(nameInput, "Name is Required!");
        isValid = false;
    }

    if (!emailInput.value.trim()) {
        showError(emailInput, "Email is Required!");
        isValid = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, "Invalid Email Address!");
            isValid = false;
        }
    }

    if (!mobileInput.value.trim()) {
        showError(mobileInput, "Mobile Number is Required!");
        isValid = false;
    } else {
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobileInput.value.trim())) {
            showError(mobileInput, "Invalid Mobile Number!");
            isValid = false;
        }
    }

    const allowedStatus = ['new', 'contacted', 'qualified', 'lost'];
    if (!allowedStatus.includes(statusInput.value.trim())) {
        showError(statusInput, "Status can be New, Contacted, Qualified or Lost only");
        isValid = false;
    }

    return isValid;
}

function showError(inputElement, errorMessage) {
    inputElement.parentElement.classList.add('invalid');
    inputElement.parentElement.querySelector('.error-msg').textContent = errorMessage;
}

function clearValidationErrors() {
    const groups = leadForm.querySelectorAll('.form-group');
    groups.forEach(group => group.classList.remove('invalid'));
}

//API call functions
async function renderLeads() {
    try {
        const response = await API.loadLeads();
        let leads = response.data;

        if (response.length === 0) {
            leadsTable.style.display = "none";
            noLeadsMessage.style.display = "block";
            return;
        }

        leadsTable.style.display = "table";
        noLeadsMessage.style.display = "none";
        leadsTableBody.innerHTML = "";

        leads.forEach(lead => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
            <td>${new Date(lead.created_at).toLocaleDateString()}</td>
            <td><strong>${lead.name}</strong></td>
            <td>${lead.email}</td>
            <td>${lead.mobile}</td>
            <td>${lead.company}</td>
            <td>${lead.source}</td>
            <td>
                <select class="status-dropdown">
                    <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
                    <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="qualified" ${lead.status === 'qualified' ? 'selected' : ''}>Qualified</option>
                    <option value="lost" ${lead.status === 'lost' ? 'selected' : ''}>Lost</option>
                </select>
            </td>
            <td>
                <button class="btn btn-primary btn-small save-btn" disabled>Save</button>
                <button class="btn btn-warning btn-small delete-btn">Delete</button>
            </td>
            `;

            const statusDropdown = tr.querySelector('.status-dropdown');
            const saveButton = tr.querySelector('.save-btn');
            const deleteButton = tr.querySelector('.delete-btn');

            statusDropdown.addEventListener('change', () => {
                saveButton.disabled = false; // Enable the save button for this row only!
            });

            saveButton.addEventListener('click', async () => {
                const selectedStatus = statusDropdown.value;

                await handleSaveStatus(lead.id, selectedStatus, saveButton);
            });

            deleteButton.addEventListener('click', async () => {
                await handleDeleteLead(lead.id, tr, deleteButton);
            })

            leadsTableBody.appendChild(tr);


        });


        console.log(leads);

    } catch (error) {
        alert("Failed to Render Data");
    }

}

async function handleSaveStatus(leadId, newStatus, buttonElement) {
    try {
        buttonElement.innerText = "Saving...";
        buttonElement.disabled = true;

        //added delay for UX 
        await new Promise(resolve => setTimeout(resolve, 250));

        await API.updateLeadStatus(leadId, { status: newStatus });

        buttonElement.innerText = "Save";
    } catch (error) {
        alert("Failed to save status. Try again.");
        buttonElement.innerText = "Save";
        buttonElement.disabled = false;
    }
}

async function handleDeleteLead(leadId, currentLead, buttonElement) {
    try {
        buttonElement.innerText = "Deleting...";
        buttonElement.disabled = true;

        //added delay for UX 
        await new Promise(resolve => setTimeout(resolve, 250));

        await API.deleteLead(leadId);

        buttonElement.disabled = false;
        buttonElement.innerText = "Delete";
        currentLead.remove();
    } catch (error) {
        alert("Failed to delete status. Try again.");
        buttonElement.innerText = "Delete";
        buttonElement.disabled = false;
    }

}

async function saveNewLead(leadData) {
    try {
        const response = await API.createNewLead(leadData);

        if (response.success == false) {
            showError(emailInput, response.message)
            console.log(response.message)
        }
        console.log(response);
    } catch (error) {
        alert("Failed to Save New Lead!", error);
    }
}