import { useEffect, useState } from "react";
import { CarsAPI } from "../services/cars";
import { OwnersAPI } from "../services/owners";
import ErrorBanner from "../components/ErrorBanner";
import FormField from "../components/FormField";
import Button from "../components/Button";
export default function CarEditor({ carId, onDone }) {
  const [owners, setOwners] = useState([]);
  const [problem, setProblem] = useState(null);

  const [suggestions, setSuggestions] = useState({
    brands: [],
    models: [],
    colors: [],
  });

  const [form, setForm] = useState({
    brand: "",
    model: "",
    color: "",
    registrationNumber: "",
    modelYear: "",
    price: "",
    ownerId: "",
  });

  const editing = Boolean(carId);
  useEffect(() => {
    OwnersAPI.list().then(setOwners);
    CarsAPI.list().then((all) => {
      const brands = Array.from(
        new Set(all.map((c) => c.brand).filter(Boolean))
      ).sort();
      const models = Array.from(
        new Set(all.map((c) => c.model).filter(Boolean))
      ).sort();
      const colors = Array.from(
        new Set(all.map((c) => c.color).filter(Boolean))
      ).sort();
      setSuggestions({ brands, models, colors });
    });

    if (editing) {
      CarsAPI.get(carId).then((c) =>
        setForm({
          brand: c.brand,
          model: c.model,
          color: c.color,
          registrationNumber: c.registrationNumber,
          modelYear: String(c.modelYear),
          price: String(c.price),
          ownerId: String(c.owner?.id ?? ""),
        })
      );
    }
  }, [carId]);
  function up(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setProblem(null);

    const payload = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      color: form.color.trim(),
      registrationNumber: form.registrationNumber.trim(),
      modelYear: Number(form.modelYear),
      price: Number(form.price),
      ownerId: Number(form.ownerId),
    };
    try {
      if (editing) await CarsAPI.update(carId, payload);
      else await CarsAPI.create(payload);
      onDone?.();
    } catch (err) {
      setProblem(err.problem || { title: "Error", detail: String(err) });
    }
  }
  return (
    <form onSubmit={submit}>
      <ErrorBanner problem={problem} />
      <div className="grid">
        <FormField
          label="Brand"
          value={form.brand}
          onChange={(v) => up("brand", v)}
          options={suggestions.brands}
          required
        />
        <FormField
          label="Model"
          value={form.model}
          onChange={(v) => up("model", v)}
          options={(() => {
            const all = suggestions.models;
            if (!form.brand) return all;
            const fallback = all;
            return fallback;
          })()}
          required
        />
        <FormField
          label="Color"
          value={form.color}
          onChange={(v) => up("color", v)}
          options={suggestions.colors}
          required
        />
        <FormField
          label="Registration"
          value={form.registrationNumber}
          onChange={(v) => up("registrationNumber", v)}
          required
        />
        <FormField
          label="Model Year"
          type="number"
          value={form.modelYear}
          onChange={(v) => up("modelYear", v)}
          min="1900"
          required
        />
        <FormField
          label="Price"
          type="number"
          value={form.price}
          onChange={(v) => up("price", v)}
          min="0"
          required
        />
        <div className="field">
          <label>Owner</label>
          <select
            className="input"
            value={form.ownerId}
            onChange={(e) => up("ownerId", e.target.value)}
            required
          >
            <option value="">Select owner…</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.firstName} {o.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="stack mt-4">
        <Button type="submit">{editing ? "Update" : "Create"}</Button>
        <Button type="button" variant="soft" onClick={() => onDone?.()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}