import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AppLayout>
            <Head title="Login - Infinity Game" />

            <main className="login-section">
                <div className="login-container">
                    <div className="login-header">
                        <h2>Masuk ke Akun</h2>
                        <p>Selamat datang kembali, Gamer!</p>
                    </div>

                    {status && (
                        <div className="form-status-success">{status}</div>
                    )}

                    <form className="login-form" onSubmit={submit}>
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
                                autoFocus
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
                                placeholder="Masukkan password Anda"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="field-error">{errors.password}</p>}
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                /> Ingat saya
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="forgot-password">
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <button type="submit" className="btn-login" disabled={processing}>
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Belum punya akun? <Link href={route('register')}>Daftar sekarang</Link></p>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
