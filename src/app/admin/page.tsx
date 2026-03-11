import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

// searchParams is a build-in prop that Next.js provides for us to read query parameters

export default async function AdminPage({
    searchParams,}: { searchParams: Promise<{ [key: string]: string| string[] | undefined }> }) {

    // get the password from the url and the .env file
    const { pw } = await searchParams;
    const adminPassword = process.env.ADMIN_PASSWORD;
    // if the password is missing or incorrect, redirect to home page
    if (pw !== adminPassword) {
        return (
            <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-sm">
                <span className="text-4xl mb-4 block">🔒</span>
                <h1 className="text-xl font-serif text-stone-900 mb-2">Lista de invitați este blocată</h1>
                <p className="text-stone-500 text-sm">
                    Vă rugăm să introduceți parola corectă în URL pentru a accesa această pagină.
                </p>
                </div>
            </div>
        );
    }

    // if the password is correct, fetch the guest list from the database
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: guests, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        return <div className="p-10">Eroare încărcare listă invitați: {error.message}</div>;
    }

    // simple math for the tally
    const attendingCount = guests.filter(g => g.is_attending).length;
    const totalPlusOnes = guests.filter(g => g.plus_one).length;
    const totalGuests = attendingCount + totalPlusOnes;

    return (
        <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-serif mb-8 text-stone-900">Listă Invitați</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                    <p className="text-stone-500 text-sm uppercase">Confirmări primite</p>
                    <p className="text-3xl text-stone-400 font-bold">{guests.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                    <p className="text-stone-500 text-sm uppercase">Total Oameni</p>
                    <p className="text-3xl text-stone-400 font-bold">{totalGuests}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                    <p className="text-stone-500 text-sm uppercase">Refuzuri</p>
                    <p className="text-3xl text-stone-400 font-bold">{guests.length - attendingCount}</p>
                </div>
            </div>

            {/* Guest Table */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-stone-100">
                <tr>
                    <th className="p-4 text-sm font-semibold text-stone-600">Nume</th>
                    <th className="p-4 text-sm font-semibold text-stone-600 w-32">Status</th>
                    <th className="p-4 text-sm font-semibold text-stone-600">Plus Unu</th>
                    {/*<th className="p-4 text-sm font-semibold text-stone-600">Nume Plus Unu</th>*/}
                    <th className="p-4 text-sm font-semibold text-stone-600">Observații</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                {guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4">
                            <div className="flex flex-col">
                                <span className="font-medium text-stone-900">{guest.full_name}</span>
                                {/* Show the plus one name directly under the main name in a smaller font */}
                                {guest.plus_one && (
                                    <span className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                                        <span className="text-lg leading-none">+</span>
                                        {guest.plus_one_name || 'Invitat'}
                                    </span>
                                )}
                            </div>
                        </td>

                        <td className="p-4">
                            <div className="flex">
                            {guest.is_attending ? (
                                <span className="inline-flex items-center justify-center w-24 py-1 px-2 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                                    Confirmat
                                </span>
                                ) : (
                                <span className="inline-flex items-center justify-center w-24 py-1 px-2 rounded-md bg-stone-100 text-stone-500 text-xs font-medium border border-stone-200">
                                    Refuzat
                                </span>
                                )}
                            </div>
                        </td>

                        <td className="p-4 text-center">
                            {/* A clear visual badge for the count */}
                            <span className="text-sm font-semibold text-stone-700 bg-stone-200/50 px-2 py-1 rounded-full">
                                {guest.is_attending ? (guest.plus_one ? '2' : '1') : '0'}
                            </span>
                        </td>

                        <td className="p-4 text-sm text-stone-600 max-w-xs truncate">
                            {guest.dietary_restrictions && <span title={guest.dietary_restrictions}>🍴 {guest.dietary_restrictions}</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}