import AdminLayout from "@/Layouts/AdminLayout"
import { Head, Link } from "@inertiajs/react"

export default function Contact({ contacts }) {
    return (
        <AdminLayout mainPage="Contacts" page="contacts">
            <Head title="Contact message" />

            <div className="bg-white shadow rounded overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Phone</th>
                        <th className="px-4 py-2 text-left">Subject</th>
                        <th className="px-4 py-2 text-left">Message</th>
                    </tr>
                    </thead>
                    <tbody>
                        
                    {contacts.data.map((contact) => (
                        <tr key={contact.id} className="border-t">
                            <td className="px-4 py-2">
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {contact.name}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {contact.email}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {contact.phone}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {contact.subject}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {contact.message}
                                </span>
                            </td>
                        </tr>
                    ))}
        
                    {contacts.data.length === 0 && (
                        <tr>
                        <td
                            colSpan="5"
                            className="px-4 py-4 text-center text-gray-500"
                        >
                            No contacts found.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="p-3 flex gap-2">
                    {contacts.links.map((l,i)=>(
                        <Link key={i}
                        href={l.url || "#"}
                        dangerouslySetInnerHTML={{__html:l.label}}
                        className={`flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 ${l.active?'bg-brand-500 text-white':'bg-white'} ${!l.url?'opacity-40 pointer-events-none':''}`}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    )
}