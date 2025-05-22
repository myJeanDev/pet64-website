export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        // Using a form submission 
        const formData = await request.formData();
        const code = formData.get('code');
        const title = formData.get('title');
        const map = formData.get('map');

        // validation if form requirements do not catch
        if (!code || !title || !map) {
            return new Response('Missing required fields (code, title, map)', {
                status: 400
            });
        }

        const timeCreated = new Date().toISOString();

        const sqlStatement = env.DB.prepare(
            "INSERT INTO displays (code, title, map, timeCreated) VALUES (?1, ?2, ?3, ?4)"
        ).bind(code, title, map, timeCreated);

        const { success } = await sqlStatement.run();

        if (success) {
            return Response.redirect(`${url.origin}/displays`, 303);
        } else {
            return new Response('Failed to create display', { status: 500 });
        }

    } catch (error) {
        return new Response(`Error creating display: ${error}`, {
            status: 500
        });
    }
}