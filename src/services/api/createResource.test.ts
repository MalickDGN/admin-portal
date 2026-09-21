import { describe, expect, it, vi } from "vitest";
import { createResourceService } from "./createResource";

vi.stubEnv("VITE_USE_MOCKS", "true");

interface Widget {
  id: string;
  name: string;
}

describe("createResourceService (mode mock)", () => {
  // Chaque test utilise un nom de ressource unique : le store mock est un
  // singleton par nom de ressource (voir mockStore.ts).
  function freshService(seed: Widget[]) {
    return createResourceService<Widget>(`widgets-${crypto.randomUUID()}`, seed);
  }

  it("liste les éléments initiaux", async () => {
    const service = freshService([{ id: "1", name: "A" }]);
    const items = await service.list();
    expect(items).toEqual([{ id: "1", name: "A" }]);
  });

  it("crée un élément avec un id généré", async () => {
    const service = freshService([]);
    const created = await service.create({ name: "Nouveau" });
    expect(created.name).toBe("Nouveau");
    expect(created.id).toBeTruthy();
    const items = await service.list();
    expect(items).toHaveLength(1);
  });

  it("met à jour un élément existant", async () => {
    const service = freshService([{ id: "1", name: "A" }]);
    const updated = await service.update("1", { name: "B" });
    expect(updated.name).toBe("B");
  });

  it("supprime un élément", async () => {
    const service = freshService([{ id: "1", name: "A" }]);
    await service.remove("1");
    const items = await service.list();
    expect(items).toHaveLength(0);
  });
});
