import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "../EmptyState/EmptyState";
import { Button } from "../Button/Button";

export default function ForbiddenPage() {
  return (
    <div style={{ paddingTop: 40 }}>
      <EmptyState
        icon={ShieldAlert}
        title="403 — Accès non autorisé"
        description="Votre rôle ne permet pas d'accéder à cette page."
        action={
          <Link to="/dashboard">
            <Button variant="outline">Retour au dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
