import {
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

type Province = { id: number; name: string };
type Regency = { id: number; name: string; province_id: number };
type District = { id: number; name: string; regency_id: number };

export async function loader() {
  const base = import.meta.env.BASE_URL;
  const response = await fetch(base + "data/indonesia_regions.json");

  if (!response.ok) {
    throw new Error("Failed to load indonesia_regions.json");
  }

  const data = await response.json();

  return {
    provinces: data.provinces ?? [],
    regencies: data.regencies ?? [],
    districts: data.districts ?? [],
  };
}

function toInt(v: string | null) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function FilterPage() {
  const { provinces, regencies, districts } = useLoaderData() as {
    provinces: Province[];
    regencies: Regency[];
    districts: District[];
  };
  const [searchParams, setSearchParams] = useSearchParams();

  const provinceId = toInt(searchParams.get("province"));
  const regencyId = toInt(searchParams.get("regency"));
  const districtId = toInt(searchParams.get("district"));

  const selectedProvince = provinceId ? provinces.find((p) => p.id === provinceId) ?? null : null;
  const regenciesByProvince = selectedProvince ? regencies.filter((r) => r.province_id === selectedProvince.id) : [];
  const selectedRegency = regencyId ? regenciesByProvince.find((r) => r.id === regencyId) ?? null : null;
  const districtsByRegency = selectedRegency ? districts.filter((d) => d.regency_id === selectedRegency.id) : [];
  const selectedDistrict = districtId ? districtsByRegency.find((d) => d.id === districtId) ?? null : null;

  function updateParam(key: "province" | "regency" | "district", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);

    if (key === "province") {
      next.delete("regency");
      next.delete("district");
    }
    if (key === "regency") {
      next.delete("district");
    }

    setSearchParams(next, { replace: true });
  }

  function reset() {
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  const crumbs = [selectedProvince?.name, selectedRegency?.name, selectedDistrict?.name].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Frontend Assessment</h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Provinsi</label>
                <select
                  name="province"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                  value={provinceId ?? ""}
                  onChange={(e) => updateParam("province", e.target.value)}
                >
                  <option value="">Pilih provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Kota/Kabupaten</label>
                <select
                  name="regency"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 disabled:bg-slate-100"
                  value={regencyId ?? ""}
                  onChange={(e) => updateParam("regency", e.target.value)}
                  disabled={!selectedProvince}
                >
                  <option value="">{selectedProvince ? "Pilih kota/kabupaten" : "Pilih provinsi dulu"}</option>
                  {regenciesByProvince.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Kecamatan</label>
                <select
                  name="district"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 disabled:bg-slate-100"
                  value={districtId ?? ""}
                  onChange={(e) => updateParam("district", e.target.value)}
                  disabled={!selectedRegency}
                >
                  <option value="">{selectedRegency ? "Pilih kecamatan" : "Pilih kota/kabupaten dulu"}</option>
                  {districtsByRegency.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <nav className="breadcrumb text-sm text-slate-500">
              {crumbs.length ? `Indonesia » ${crumbs.join(" » ")}` : "Indonesia"}
            </nav>

            <main className="mt-10 flex flex-col items-center justify-center gap-10 py-12 text-center">
              <div>
                <div className="text-xs font-semibold tracking-widest text-slate-400">PROVINSI</div>
                <div className="mt-2 text-4xl font-bold">{selectedProvince?.name ?? "-"}</div>
              </div>

              <div className="text-slate-300">↓</div>

              <div>
                <div className="text-xs font-semibold tracking-widest text-slate-400">KOTA / KABUPATEN</div>
                <div className="mt-2 text-4xl font-bold">{selectedRegency?.name ?? "-"}</div>
              </div>

              <div className="text-slate-300">↓</div>

              <div>
                <div className="text-xs font-semibold tracking-widest text-slate-400">KECAMATAN</div>
                <div className="mt-2 text-4xl font-bold">{selectedDistrict?.name ?? "-"}</div>
              </div>
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}