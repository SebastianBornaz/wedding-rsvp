'use server'
import { createClient } from '@supabase/supabase-js'

export async function submitRSVP(formData: FormData) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase credentials are not set');
        return { success: false, error: "Server configuration error" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const rawName = formData.get('name');
    const rawAttending = formData.get('attending');
    const plusOne = formData.get('plus_one');

    if (!rawName || typeof rawName !== 'string') {
        return { success: false, error: "Va rugam sa introduceti un nume valid" };
    }

    const isAttending = rawAttending === 'true';

    // If they are attending, we can optionally have a plus one and dietary restrictions
    const guestData = {
        full_name: rawName.trim(),
        is_attending: isAttending,
        plus_one: isAttending ? plusOne : null,
        plus_one_name: isAttending && plusOne ? (formData.get('plus_one_name') as string)?.trim() : null,
        dietary_restrictions: isAttending ? (formData.get('dietary_restrictions') as string)?.trim() : null,
        created_at: new Date().toISOString(),
    };

    // Send it to database
    try {
        const { error } = await supabase
            .from('guests')
            .insert([guestData]);

        if (error) {
            console.error("Database error:", error.message);
            return { success: false, error: "Nu am putut salva confirmarea ta. Te rugam sa incerci din nou." };
        }

        return { success: true };
    } catch (err) {
        console.error("Unexpected error:", err);
        return { success: false, error: "A aparut o eroare neasteptata. Te rugam sa incerci din nou." };
    }
}
