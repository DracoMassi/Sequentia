from PIL import Image
import os
import tkinter as tk
from tkinter import filedialog, messagebox

# --- Sélection des dossiers avec tkinter ---
root = tk.Tk()
root.withdraw()  # On cache la fenêtre principale

messagebox.showinfo("Conversion WEBP", "Sélectionnez le dossier contenant vos images.")
src = filedialog.askdirectory(title="Dossier source (images)")

if not src:
    messagebox.showerror("Erreur", "Aucun dossier source sélectionné.")
    exit()

messagebox.showinfo("Conversion WEBP", "Sélectionnez le dossier où enregistrer les images converties.")
dst = filedialog.askdirectory(title="Dossier destination (WEBP)")

if not dst:
    messagebox.showerror("Erreur", "Aucun dossier destination sélectionné.")
    exit()

# --- Conversion ---
count = 0
for root_dir, _, files in os.walk(src):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(root_dir, file)
            img = Image.open(img_path).convert("RGBA")
            name, _ = os.path.splitext(file)
            out_path = os.path.join(dst, f"{name}.webp")
            img.save(out_path, "WEBP", quality=90)
            count += 1
            print(f"✅ Converti : {file} → {out_path}")

messagebox.showinfo("Terminé", f"Conversion terminée !\n{count} image(s) convertie(s).")
