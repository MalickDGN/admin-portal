import { expect, test } from "@playwright/test";

/**
 * Parcours critique bout-en-bout, tel que décrit au §23 du cahier des charges :
 * Login → Dashboard → Recherche → Consultation → Création → Modification → Suppression.
 * Les données viennent du store mock (VITE_USE_MOCKS=true), donc ce test ne
 * dépend d'aucun backend réel.
 */
test.describe("Parcours critique Produits", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("demo@adaa.sn");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("affiche le dashboard après connexion", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Revenu")).toBeVisible();
  });

  test("recherche, consulte, crée, modifie et supprime un produit", async ({ page }) => {
    await page.getByRole("link", { name: "Catalogue" }).click();
    await expect(page).toHaveURL(/\/ecommerce\/products/);

    // Recherche
    await page.getByPlaceholder("Rechercher un produit...").fill("Bougie");
    await expect(page.getByText("Bougie Ambre & Vanille")).toBeVisible();
    await expect(page.getByText("Coffret parfum Oud Royal")).not.toBeVisible();
    await page.getByPlaceholder("Rechercher un produit...").fill("");

    // Création
    await page.getByRole("button", { name: "Nouveau produit" }).click();
    await page.getByLabel("Nom du produit").fill("Produit E2E");
    await page.getByRole("button", { name: "Catégorie" }).click();
    await page.getByRole("option", { name: "Soin" }).click();
    await page.getByLabel("Prix (F CFA)").fill("9900");
    await page.getByLabel("Stock").fill("15");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Produit créé")).toBeVisible();
    await expect(page.getByText("Produit E2E")).toBeVisible();

    // Modification
    const row = page.getByRole("row", { name: /Produit E2E/ });
    await row.getByRole("button", { name: "Modifier" }).click();
    await page.getByLabel("Nom du produit").fill("Produit E2E modifié");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Produit mis à jour")).toBeVisible();
    await expect(page.getByText("Produit E2E modifié")).toBeVisible();

    // Suppression
    const updatedRow = page.getByRole("row", { name: /Produit E2E modifié/ });
    await updatedRow.getByRole("button", { name: "Supprimer" }).click();
    await expect(page.getByText('"Produit E2E modifié" supprimé')).toBeVisible();
    await expect(page.getByText("Produit E2E modifié")).not.toBeVisible();
  });
});

test.describe("Parcours critique Commandes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("demo@adaa.sn");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.getByRole("link", { name: "Commandes" }).first().click();
    await expect(page).toHaveURL(/\/ecommerce\/orders/);
  });

  test("consulte une commande et change son statut", async ({ page }) => {
    const row = page.getByRole("row", { name: /CMD-1046/ });
    await row.getByRole("button", { name: "Détails" }).click();
    await expect(page.getByRole("heading", { name: "CMD-1046" })).toBeVisible();
    await page.getByRole("button", { name: /Marquer comme/ }).click();
    await expect(page.getByText(/mise à jour/)).toBeVisible();
  });
});

test.describe("RBAC", () => {
  test("un accès direct à /ecommerce/customers sans connexion redirige vers le login", async ({ page }) => {
    await page.goto("/ecommerce/customers");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
