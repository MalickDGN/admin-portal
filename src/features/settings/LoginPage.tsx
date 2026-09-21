import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@ui/Button/Button";
import { useAuth } from "@services/auth/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: remplacer par un appel réel à services/api/auth.ts
    setTimeout(() => {
      login(
        { id: "1", name: "M.DGN", email, role: "ADMIN", permissions: ["*"] },
        "mock-token",
      );
      setLoading(false);
      navigate("/dashboard");
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0 }}>Connexion</h2>
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginTop: 4,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-background)",
            color: "var(--color-text)",
          }}
        />
      </label>
      <Button type="submit" loading={loading} style={{ width: "100%" }}>
        Se connecter
      </Button>
    </form>
  );
}
