export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const errors = [];

    // Simple profanity filter function
    function containsProfanity(text) {
        const badWords = [
            'fuck', 'shit', 'bitch', 'damn', 'ass', 'hell', 'crap',
            'piss', 'dick', 'cock', 'pussy', 'slut', 'whore', 'bastard',
            'nigger', 'nigga', 'faggot', 'retard', 'gay', 'homo'
            // Add more words as needed
        ];

        const lowerText = text.toLowerCase();
        return badWords.some(word => lowerText.includes(word));
    }

    try {
        // Using a form submission 
        const formData = await request.formData();
        const uuid = formData.get('uuid');
        const title = formData.get('title');
        const dotImage = formData.get('dotImage');

        // Required field validation
        if (!uuid || !title || !dotImage) {
            errors.push('Missing required fields');
        }

        // Type and format validation
        if (uuid && (typeof uuid !== 'string' || uuid.length > 64)) {
            errors.push('uuid must be a string under 64 characters');
        }

        if (title && (typeof title !== 'string' || title.length > 16)) {
            errors.push('Title must be a string under 16 characters');
        }

        // Profanity check
        if (title && containsProfanity(title)) {
            errors.push('Title contains inappropriate language');
        }

        // Validate valid JSON
        if (dotImage) {
            try {
                JSON.parse(dotImage);
            } catch {
                errors.push('dotImage must be valid JSON');
            }
        }

        // Return errors if any exist
        if (errors.length > 0) {
            return new Response(JSON.stringify({ errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const timeCreated = new Date().toISOString();

        const sqlStatement = env.DB.prepare(
            "INSERT INTO displays (code, title, map, timeCreated) VALUES (?1, ?2, ?3, ?4)"
        ).bind(uuid, title, dotImage, timeCreated);

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