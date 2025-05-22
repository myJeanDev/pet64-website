export async function onRequestGet(context) {
    const { env } = context;

    try {
        const sqlStatement = env.DB.prepare("SELECT * FROM displays");
        const { results } = await sqlStatement.all();

        // Return JSON directly instead of HTML
        return Response.json(results);

    } catch (error) {
        return new Response(`Error fetching displays: ${error}`, {
            status: 500
        });
    }
}