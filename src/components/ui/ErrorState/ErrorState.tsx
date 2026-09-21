import { AlertTriangle } from "lucide-react";
import { Button } from "../Button/Button";
import "./ErrorState.css";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * État d'erreur illustré, générique (§14). Utilisé partout où une requête
 * peut échouer : chargement de liste, formulaire, dashboard.
 */
export function ErrorState({
  title = "Une erreur est survenue",
  description = "Le chargement des données a échoué. Réessayez dans un instant.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <AlertTriangle size={28} strokeWidth={1.5} />
      </div>
      <p className="error-state__title">{title}</p>
      <p className="error-state__description">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="error-state__action">
          Réessayer
        </Button>
      )}
    </div>
  );
}
