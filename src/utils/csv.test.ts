import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("génère un en-tête et des lignes séparés par des virgules", () => {
    const csv = toCsv(["Nom", "Prix"], [["Bougie", 12000], ["Savon", 4500]]);
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe("Nom,Prix");
    expect(lines[1]).toBe("Bougie,12000");
    expect(lines[2]).toBe("Savon,4500");
  });

  it("échappe les cellules contenant une virgule, un guillemet ou un saut de ligne", () => {
    const csv = toCsv(["Nom"], [['Coffret "Deluxe", édition limitée']]);
    expect(csv.split("\r\n")[1]).toBe('"Coffret ""Deluxe"", édition limitée"');
  });

  it("gère un jeu de données vide en ne renvoyant que l'en-tête", () => {
    const csv = toCsv(["Nom", "Prix"], []);
    expect(csv).toBe("Nom,Prix");
  });
});
