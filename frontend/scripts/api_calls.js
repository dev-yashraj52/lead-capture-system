export async function loadLeads() {
    try {
        const response = await fetch(
            `http://localhost:3000/leads`
        );

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Database Connection Refused");
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