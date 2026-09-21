import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { EmptyState } from "../EmptyState/EmptyState";
import { Button } from "../Button/Button";

export default function NotFoundPage() {
  return (
    <div style={{ paddingTop: 40 }}>
      <EmptyState
        icon={FileQuestion}
        title="404 — Page introuvable"
        description="La page que vous cherchez n'existe pas ou a été déplacée."
        action={
          <Link to="/dashboard">
            <Button variant="outline">Retour au dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
