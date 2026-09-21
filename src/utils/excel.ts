import * as XLSX from "xlsx";

/**
 * Génération et téléchargement d'un fichier Excel (.xlsx) natif, via SheetJS.
 * Complète utils/csv.ts pour les utilisateurs qui préfèrent un classeur
 * Excel plutôt qu'un CSV (mise en forme des nombres, plusieurs feuilles
 * possibles à terme, etc.).
 */
export function downloadXlsx(filename: string, sheetName: string, headers: string[], rows: (string | number)[][]) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31)); // limite Excel : 31 caractères
  XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}
