import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    provinces = [],
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            province_id: user.province_id || '',
            province: user.province || '',
            city_id: user.city_id || '',
            city: user.city || '',
            district_id: user.district_id || '',
            district: user.district || '',
            postal_code: user.postal_code || '',
        });

    useEffect(() => {
        const loadSavedLocations = async () => {
            try {
                if (user.province_id) {
                    const cityResponse = await axios.get(`/cities/${user.province_id}`);
                    setCities(cityResponse.data);
                }

                if (user.city_id) {
                    const districtResponse = await axios.get(`/districts/${user.city_id}`);
                    setDistricts(districtResponse.data);
                }
            } catch (error) {
                console.error('Error loading saved shipping address:', error);
            }
        };

        loadSavedLocations();
    }, [user.city_id, user.province_id]);

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        const province = provinces.find((item) => String(item.id) === String(provinceId));

        setData((current) => ({
            ...current,
            province_id: provinceId,
            province: province?.name || '',
            city_id: '',
            city: '',
            district_id: '',
            district: '',
        }));
        setCities([]);
        setDistricts([]);

        if (provinceId) {
            try {
                const response = await axios.get(`/cities/${provinceId}`);
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        }
    };

    const handleCityChange = async (e) => {
        const cityId = e.target.value;
        const city = cities.find((item) => String(item.id) === String(cityId));

        setData((current) => ({
            ...current,
            city_id: cityId,
            city: city?.name || '',
            district_id: '',
            district: '',
        }));
        setDistricts([]);

        if (cityId) {
            try {
                const response = await axios.get(`/districts/${cityId}`);
                setDistricts(response.data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        }
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const district = districts.find((item) => String(item.id) === String(districtId));

        setData((current) => ({
            ...current,
            district_id: districtId,
            district: district?.name || '',
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account profile and default checkout details.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-100 text-gray-500"
                        value={data.email}
                        required
                        disabled
                        readOnly
                        autoComplete="username"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Email dikunci dan mengikuti email akun ini.
                    </p>

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone" />

                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="081234567890"
                    />

                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900">
                        Shipping Address
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Data ini akan otomatis dipakai di checkout.
                    </p>
                </div>

                <div>
                    <InputLabel htmlFor="address" value="Address" />

                    <TextInput
                        id="address"
                        className="mt-1 block w-full"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        autoComplete="street-address"
                    />

                    <InputError className="mt-2" message={errors.address} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="province_id" value="Province" />

                        <select
                            id="province_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.province_id || ''}
                            onChange={handleProvinceChange}
                        >
                            <option value="">Select province</option>
                            {provinces.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>

                        <InputError className="mt-2" message={errors.province} />
                        <InputError className="mt-2" message={errors.province_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="city_id" value="City" />

                        <select
                            id="city_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.city_id || ''}
                            onChange={handleCityChange}
                            disabled={!data.province_id}
                        >
                            <option value="">Select city</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>

                        <InputError className="mt-2" message={errors.city} />
                        <InputError className="mt-2" message={errors.city_id} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="district_id" value="District" />

                        <select
                            id="district_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.district_id || ''}
                            onChange={handleDistrictChange}
                            disabled={!data.city_id}
                        >
                            <option value="">Select district</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>

                        <InputError className="mt-2" message={errors.district} />
                        <InputError className="mt-2" message={errors.district_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="postal_code" value="Postal Code" />

                        <TextInput
                            id="postal_code"
                            className="mt-1 block w-full"
                            value={data.postal_code}
                            onChange={(e) => setData('postal_code', e.target.value)}
                            autoComplete="postal-code"
                        />

                        <InputError className="mt-2" message={errors.postal_code} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
