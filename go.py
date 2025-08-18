from PIL import Image
import cairosvg
import os
from tkinter import Tk, filedialog, messagebox
import io

def main():
    root = Tk()
    root.withdraw()  # Masquer la fenêtre principale

    try:
        # Sélection des fichiers SVG
        svg_files = filedialog.askopenfilenames(
            title="Sélectionnez les fichiers SVG à convertir",
            filetypes=[("Fichiers SVG", "*.svg")]
        )
        if not svg_files:
            messagebox.showinfo("Info", "Aucun fichier sélectionné.")
            input("Appuyez sur Entrée pour fermer...")
            return

        # Sélection du dossier de destination
        dst = filedialog.askdirectory(title="Sélectionnez le dossier de destination")
        if not dst:
            messagebox.showinfo("Info", "Aucun dossier sélectionné.")
            input("Appuyez sur Entrée pour fermer...")
            return

        os.makedirs(dst, exist_ok=True)

        for svg_path in svg_files:
            name, _ = os.path.splitext(os.path.basename(svg_path))
            webp_path = os.path.join(dst, f"{name}.webp")

            # Convertir SVG en PNG en mémoire puis en WebP
            png_data = cairosvg.svg2png(url=svg_path)
            img = Image.open(io.BytesIO(png_data)).convert("RGBA")
            img.save(webp_path, "WEBP", quality=90)

        messagebox.showinfo("Succès", f"{len(svg_files)} fichiers convertis en WebP !")
        input("Conversion terminée ! Appuyez sur Entrée pour fermer...")

    except Exception as e:
        print("Erreur :", e)
        input("Appuyez sur Entrée pour fermer...")
    finally:
        root.destroy()

if __name__ == "__main__":
    main()
