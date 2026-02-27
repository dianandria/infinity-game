import { useForm, Link } from '@inertiajs/react';

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Admin Login</h1>

        <div>
          <label className="block text-sm">Email</label>
          <input
            className="w-full border rounded p-2"
            type="email"
            value={data.email}
            onChange={(e)=>setData('email', e.target.value)}
          />
          {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
        </div>

        <div>
          <label className="block text-sm">Password</label>
          <input
            className="w-full border rounded p-2"
            type="password"
            value={data.password}
            onChange={(e)=>setData('password', e.target.value)}
          />
          {errors.password && <div className="text-red-600 text-sm">{errors.password}</div>}
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.remember}
            onChange={(e)=>setData('remember', e.target.checked)}
          />
          <span>Remember me</span>
        </label>

        <button disabled={processing} className="w-full rounded bg-black text-white py-2">
          {processing ? 'Logging in…' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}
