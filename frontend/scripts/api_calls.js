export async function loadLeads(search = "") {
    try {
        const response = await fetch(
            `http://localhost:3000/leads?search=${encodeURIComponent(search)}`
        );

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Database Connection Refused");
    }

}

export async function createNewLead({ name, email, mobile, company, source, status }) {
    try {
        const response = await fetch(
            `http://localhost:3000/leads`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, mobile, company, source, status })
        }
        );

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Database Connection Refused", error);
        throw error;
    }
}

export async function updateLeadStatus(id, { status }) {
    try {
        const response = await fetch(
            `http://localhost:3000/leads/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        }
        );

        if (!response.ok) {
            throw new Error(`Server network error: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Database Connection Refused", error);
    }
}

export async function deleteLead(id) {
    try {
        const response = await fetch(
            `http://localhost:3000/leads/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        }
        );

        if (!response.ok) {
            throw new Error(`Server network error: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Database Connection Refused", error);
    }
}