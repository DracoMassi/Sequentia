import os
from openpyxl import Workbook
from tkinter import filedialog, Tk

# Masquer la fenetre Tkinter
root = Tk()
root.withdraw()

# Choisir dossier
folder = filedialog.askdirectory(title="Choisissez le dossier contenant les fichiers")
if not folder:
    print("❌ Aucun dossier sélectionné.")
    input("Appuie sur Entrée pour fermer...")
    exit()

# Creer workbook Excel
wb = Workbook()
ws = wb.active
ws.title = "Chemins relatifs"
ws.append(["Chemin relatif"])

# Ajouter fichiers
for file in os.listdir(folder):
    if os.path.isfile(os.path.join(folder, file)):
        ws.append([f"../../Fichesweb/{file}"])

# Sauvegarder fichier Excel
output_path = os.path.join(folder, "liste_fichiers.xlsx")
wb.save(output_path)

print(f"✅ Fichier Excel créé : {output_path}")
input("Appuie sur Entrée pour fermer...")
