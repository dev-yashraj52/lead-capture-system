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
            <td>${lead.status}</td>
            <td>
                <button class="btn btn-primary btn-small" onclick="editLead('${lead.id}')" disabled>Edit</button>
            </td>
            `;

            leadsTableBody.appendChild(tr);
        });


        console.log(leads);

    } catch (error) {
        console.error("Database Error", error);
    }

}