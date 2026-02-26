import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import ServiceCardSkeleton from "../../components/ServiceCardSkeleton";
import BrandLogos from "../../components/BrandLogos";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import BrandTrustStrip from "../../components/BrandTrustStrip";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load services");
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const filteredServices = services.filter((s) => {
  const matchesSearch =
    s.name.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    category === "ALL" || s.category === category;

  return matchesSearch && matchesCategory;
});

  return (
    <section className="bg-surface px-6 py-12 min-h-screen">
    
      <div className="max-w-6xl mx-auto space-y-8">
         <BrandTrustStrip  />

        {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex flex-wrap gap-4">
  <input
    type="text"
    placeholder="Search services..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="rounded-lg border border-border px-4 py-2 text-sm bg-surface"
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="rounded-lg border border-border px-4 py-2 text-sm bg-surface"
  >
    <option value="ALL">All categories</option>
    <option value="Networking">Networking</option>
    <option value="Maintenance">Maintenance</option>
    <option value="Repairs">Repairs</option>
    <option value="Enterprise">Enterprise</option>
  </select>
   
</div>
        <div className="space-y-4">
          {loading
            ? [...Array(4)].map((_, i) => <ServiceCardSkeleton key={i} />)
            : filteredServices.map((service, idx) => (
                <ServiceCard
                  key={service.slug}
                  service={service}
                  index={idx}
                  isAuthenticated={isAuthenticated}
                />
              ))}
        </div>
      </div>

     
    </section>
  );
}
