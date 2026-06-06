export async function loadLeads() {
    try {
        const response = await fetch(
            "http://localhost:3000/leads"
        );

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Database Connection Refused");
    }

}