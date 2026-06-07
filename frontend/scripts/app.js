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

document.addEventListener('DOMContentLoaded', () => { renderLeads("") });
addLeadBtn.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
leadForm.addEventListener('submit', handleFormSubmit);

searchBtn.addEventListener('click', executeSearch);

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
        company: companyInput.value.trim() || null,
        source: sourceInput.value.trim() || null,
        status: statusInput.value || 'new'
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

function executeSearch() {
    renderLeads(searchInput.value);
}

function showNotification(message, isSuccess = true) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');

    toastMsg.textContent = message;

    toast.style.backgroundColor = isSuccess ? '#2ecc71' : '#e74c3c';
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function refreshLeads(lead, id) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
            <td>${new Date().toLocaleDateString()}</td>
            <td><strong>${lead.name}</strong></td>
            <td>${lead.email}</td>
            <td>${lead.mobile}</td>
            <td>${lead.company ?? "-"}</td>
            <td>${lead.source ?? "-"}</td>
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
        saveButton.disabled = false;
    });

    saveButton.addEventListener('click', async () => {
        const selectedStatus = statusDropdown.value;

        await handleSaveStatus(id, lead.status, selectedStatus, saveButton);
    });

    deleteButton.addEventListener('click', async () => {
        await handleDeleteLead(id, lead.status, tr, deleteButton);
    })

    leadsTableBody.insertBefore(tr, leadsTableBody.firstChild);
}

function updateDashboardStats(leads) {
    document.getElementById('totalLeadsCount').textContent = leads.length;

    let newCount = 0;
    let contactedCount = 0;
    let qualifiedCount = 0;
    let lostCount = 0;

    leads.forEach(lead => {
        const status = lead.status ? lead.status.toLowerCase() : '';

        if (status === 'new') newCount++;
        else if (status === 'contacted') contactedCount++;
        else if (status === 'qualified') qualifiedCount++;
        else if (status === 'lost') lostCount++;
    });

    document.getElementById('newLeadsCount').textContent = newCount;
    document.getElementById('contactedLeadsCount').textContent = contactedCount;
    document.getElementById('qualifiedLeadsCount').textContent = qualifiedCount;
    document.getElementById('lostLeadsCount').textContent = lostCount;
}

function adjustDashboardCounts(oldStatus, newStatus) {
    if (oldStatus) {
        document.getElementById(`${oldStatus.toLowerCase()}LeadsCount`).textContent--;
        if (!newStatus) document.getElementById('totalLeadsCount').textContent--; // It was a deletion
    }
    if (newStatus) {
        document.getElementById(`${newStatus.toLowerCase()}LeadsCount`).textContent++;
        if (!oldStatus) document.getElementById('totalLeadsCount').textContent++; // It was a creation
    }
}

//API call functions
async function renderLeads(searchTerm = "") {
    try {
        const response = await API.loadLeads(searchTerm);
        let leads = response.data;

        updateDashboardStats(leads);

        if (leads.length === 0) {
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
            <td>${lead.company ?? "-"}</td>
            <td>${lead.source ?? "-"}</td>
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
                saveButton.disabled = false;
            });

            saveButton.addEventListener('click', async () => {
                const selectedStatus = statusDropdown.value;

                await handleSaveStatus(lead.id, lead.status, selectedStatus, saveButton);
            });

            deleteButton.addEventListener('click', async () => {
                await handleDeleteLead(lead.id, lead.status, tr, deleteButton);
            })

            leadsTableBody.appendChild(tr);

        });

        if (response.success) {
            showNotification(response.message, response.success);
        } else {
            showNotification(response.message, response.success);
        }

    } catch (error) {
        showNotification("Failed to Render Data", false);
        console.error(error);
    }

}

async function handleSaveStatus(leadId, oldStatus, newStatus, buttonElement) {
    try {
        buttonElement.innerText = "Saving...";
        buttonElement.disabled = true;

        //added delay for UX 
        await new Promise(resolve => setTimeout(resolve, 250));

        const response = await API.updateLeadStatus(leadId, { status: newStatus });

        if (response.success) {
            buttonElement.innerText = "Save";
            showNotification(response.message, response.success);
            adjustDashboardCounts(oldStatus, newStatus);
        } else {
            buttonElement.innerText = "Save";
            buttonElement.disabled = false;
            showNotification(response.message, response.success);
        }

    } catch (error) {
        showNotification("Failed to save status", false);
        buttonElement.innerText = "Save";
        buttonElement.disabled = false;
        console.error(error);
    }
}

async function handleDeleteLead(leadId, leadStatus, currentLead, buttonElement) {
    try {
        buttonElement.innerText = "Deleting...";
        buttonElement.disabled = true;

        //added delay for UX 
        await new Promise(resolve => setTimeout(resolve, 250));

        const response = await API.deleteLead(leadId);

        if (response.success) {
            buttonElement.disabled = false;
            buttonElement.innerText = "Delete";
            showNotification(response.message, response.success);
            adjustDashboardCounts(leadStatus, null);
            currentLead.remove();
        } else {
            showNotification(response.message, response.success);
        }


    } catch (error) {
        showNotification("Failed to delete status", false);
        buttonElement.innerText = "Delete";
        buttonElement.disabled = false;
        throw error;
    }

}

async function saveNewLead(leadData) {
    try {
        const response = await API.createNewLead(leadData);

        if (response.success) {
            closeModal();
            showNotification(response.message, response.success);
            console.log(response);
            refreshLeads(leadData, response.data.insertId);
            adjustDashboardCounts(null, leadData.status);
        } else {
            showNotification(response.message, response.success);
            showError(emailInput, response.message);
            console.log(response.message);
        }
        console.log(response);
    } catch (error) {
        showNotification("Failed to Save New Lead", false);
        throw error;
    }
}