import * as API from './api_calls.js'

const leadModal = document.getElementById('leadModal');
const leadForm = document.getElementById('leadForm')
const closeModalButton = document.getElementById('closeModalBtn');
const addLeadBtn = document.getElementById('addLeadBtn');
const cancelBtn = document.getElementById('cancelBtn');
const leadsTable = document.getElementById('leadsTable');
const noLeadsMessage = document.getElementById('noLeadsMessage');
const leadsTableBody = document.getElementById('leadsTableBody');

document.addEventListener('DOMContentLoaded', renderLeads);
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
            </td>
            `;

            const dropdown = tr.querySelector('.status-dropdown');
            const saveButton = tr.querySelector('.save-btn');

            dropdown.addEventListener('change', () => {
                saveButton.disabled = false; // Enable the save button for this row only!
            });

            saveButton.addEventListener('click', async () => {
                const selectedStatus = dropdown.value;

                await handleSaveStatus(lead.id, selectedStatus, saveButton);
            });

            leadsTableBody.appendChild(tr);


        });


        console.log(leads);

    } catch (error) {
        console.error("Database Error", error);
    }

}