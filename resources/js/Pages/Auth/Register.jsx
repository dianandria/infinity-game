import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AppLayout>
            <Head title="Daftar Akun - Infinity Game" />

            <main className="login-section">
                <div className="login-container">
                    <div className="login-header">
                        <h2>Buat Akun Baru</h2>
                        <p>Bergabunglah dengan komunitas Infinity Game!</p>
                    </div>

                    <form className="login-form" onSubmit={submit}>
                        <div className="form-group">
                            <label htmlFor="name">Nama Lengkap</label>
                            <input
                                id="name"
                                name="name"
                                className="form-control"
                                placeholder="Masukkan nama Anda"
                                value={data.name}
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="field-error">{errors.name}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Masukkan email Anda"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="field-error">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Buat password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="field-error">{errors.password}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_confirmation">Konfirmasi Password</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                className="form-control"
                                placeholder="Ulangi password Anda"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {errors.password_confirmation && <p className="field-error">{errors.password_confirmation}</p>}
                        </div>

                        <button type="submit" className="btn-login btn-login-mt" disabled={processing}>
                            {processing ? 'Memproses...' : 'Daftar'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Sudah punya akun? <Link href={route('login')}>Masuk di sini</Link></p>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
