import { useForm } from '@inertiajs/react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.login.store'));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-120px] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_25%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl md:grid-cols-2">
          {/* Left side / branding */}
          <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-indigo-500/20 p-10 text-white md:flex">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/80">
                Admin Panel
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Welcome back,
                <br />
                manage your store
                <br />
                with confidence.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                Access your dashboard, manage products, monitor orders, and keep
                your catalog updated in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-white/80">
                “Keep your product catalog organized, updated, and always ready
                for customers.”
              </p>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">
                Store Administration
              </div>
            </div>
          </div>

          {/* Right side / form */}
          <div className="bg-white p-8 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-lg">
                  A
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Admin Login</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Please sign in to access your admin dashboard.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                  />
                  {errors.email && (
                    <div className="mt-2 text-sm text-red-600">{errors.email}</div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
                    type="password"
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                  />
                  {errors.password && (
                    <div className="mt-2 text-sm text-red-600">{errors.password}</div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="inline-flex items-center gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    />
                    <span>Remember me</span>
                  </label>

                  <span className="text-sm text-slate-400">Secure Access</span>
                </div>

                <button
                  disabled={processing}
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {processing ? 'Logging in...' : 'Login as Admin'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}