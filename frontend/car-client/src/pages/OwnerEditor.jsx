import { useEffect, useState } from "react";
import { OwnersAPI } from "../services/owners";
import ErrorBanner from "../components/ErrorBanner";
import FormField from "../components/FormField";
import Button from "../components/Button";

export default function OwnerEditor({ ownerId, onDone }) {
  const [problem, setProblem] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const editing = Boolean(ownerId);
  useEffect(() => {
    if (editing) {
      OwnersAPI.get(ownerId).then((o) =>
        setForm({
          firstName: o.firstName,
          lastName: o.lastName,
          email: o.email,
          phone: o.phone || "",
        })
      );
    }
  }, [ownerId]);

  function up(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setProblem(null);
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    try {
      if (editing) await OwnersAPI.update(ownerId, payload);
      else await OwnersAPI.create(payload);
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
          label="First Name"
          value={form.firstName}
          onChange={(v) => up("firstName", v)}
          required
        />
        <FormField
          label="Last Name"
          value={form.lastName}
          onChange={(v) => up("lastName", v)}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => up("email", v)}
          required
        />
        <FormField
          label="Phone"
          value={form.phone}
          onChange={(v) => up("phone", v)}
        />
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
