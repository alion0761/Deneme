import tkinter as tk
from tkinter import ttk, messagebox
import sqlite3
from datetime import datetime

class HastaTakipSistemi:
    def __init__(self, root):
        self.root = root
        self.root.title("Hasta Takip Sistemi")
        self.root.geometry("800x600")

        # Veritabanı bağlantısı
        self.veritabani_olustur()

        # Ana frame
        self.main_frame = ttk.Frame(self.root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

        # Hasta bilgileri giriş alanı
        ttk.Label(self.main_frame, text="TC Kimlik No:").grid(row=0, column=0, sticky=tk.W)
        self.tc_no = ttk.Entry(self.main_frame, width=20)
        self.tc_no.grid(row=0, column=1, padx=5, pady=5)

        ttk.Label(self.main_frame, text="Ad Soyad:").grid(row=1, column=0, sticky=tk.W)
        self.ad_soyad = ttk.Entry(self.main_frame, width=30)
        self.ad_soyad.grid(row=1, column=1, padx=5, pady=5)

        ttk.Label(self.main_frame, text="Doğum Tarihi:").grid(row=2, column=0, sticky=tk.W)
        self.dogum_tarihi = ttk.Entry(self.main_frame, width=15)
        self.dogum_tarihi.grid(row=2, column=1, padx=5, pady=5)

        ttk.Label(self.main_frame, text="Telefon:").grid(row=3, column=0, sticky=tk.W)
        self.telefon = ttk.Entry(self.main_frame, width=15)
        self.telefon.grid(row=3, column=1, padx=5, pady=5)

        # Şikayet ve tanı alanı
        ttk.Label(self.main_frame, text="Şikayet:").grid(row=4, column=0, sticky=tk.W)
        self.sikayet = tk.Text(self.main_frame, width=40, height=4)
        self.sikayet.grid(row=4, column=1, padx=5, pady=5)

        ttk.Label(self.main_frame, text="Tanı:").grid(row=5, column=0, sticky=tk.W)
        self.tani = tk.Text(self.main_frame, width=40, height=4)
        self.tani.grid(row=5, column=1, padx=5, pady=5)

        # Butonlar
        ttk.Button(self.main_frame, text="Hasta Kaydet", command=self.hasta_kaydet).grid(row=6, column=0, pady=10)
        ttk.Button(self.main_frame, text="Hasta Ara", command=self.hasta_ara).grid(row=6, column=1, pady=10)

        # Hasta listesi
        self.tree = ttk.Treeview(self.main_frame, columns=("TC", "Ad Soyad", "Doğum Tarihi", "Telefon"), show="headings")
        self.tree.grid(row=7, column=0, columnspan=2, pady=10)

        self.tree.heading("TC", text="TC No")
        self.tree.heading("Ad Soyad", text="Ad Soyad")
        self.tree.heading("Doğum Tarihi", text="Doğum Tarihi")
        self.tree.heading("Telefon", text="Telefon")

        self.hasta_listesi_guncelle()

    def veritabani_olustur(self):
        conn = sqlite3.connect('hasta_takip.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS hastalar
                    (tc_no TEXT PRIMARY KEY,
                     ad_soyad TEXT,
                     dogum_tarihi TEXT,
                     telefon TEXT,
                     sikayet TEXT,
                     tani TEXT,
                     kayit_tarihi TEXT)''')
        conn.commit()
        conn.close()

    def hasta_kaydet(self):
        tc = self.tc_no.get()
        ad = self.ad_soyad.get()
        dogum = self.dogum_tarihi.get()
        tel = self.telefon.get()
        sikayet = self.sikayet.get("1.0", tk.END)
        tani = self.tani.get("1.0", tk.END)
        kayit_tarihi = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if not tc or not ad:
            messagebox.showerror("Hata", "TC No ve Ad Soyad alanları zorunludur!")
            return

        try:
            conn = sqlite3.connect('hasta_takip.db')
            c = conn.cursor()
            c.execute("INSERT OR REPLACE INTO hastalar VALUES (?,?,?,?,?,?,?)",
                     (tc, ad, dogum, tel, sikayet, tani, kayit_tarihi))
            conn.commit()
            conn.close()
            messagebox.showinfo("Başarılı", "Hasta kaydedildi!")
            self.formu_temizle()
            self.hasta_listesi_guncelle()
        except Exception as e:
            messagebox.showerror("Hata", f"Kayıt sırasında hata oluştu: {str(e)}")

    def hasta_ara(self):
        tc = self.tc_no.get()
        if not tc:
            messagebox.showerror("Hata", "TC No giriniz!")
            return

        conn = sqlite3.connect('hasta_takip.db')
        c = conn.cursor()
        c.execute("SELECT * FROM hastalar WHERE tc_no=?", (tc,))
        hasta = c.fetchone()
        conn.close()

        if hasta:
            self.ad_soyad.delete(0, tk.END)
            self.ad_soyad.insert(0, hasta[1])
            self.dogum_tarihi.delete(0, tk.END)
            self.dogum_tarihi.insert(0, hasta[2])
            self.telefon.delete(0, tk.END)
            self.telefon.insert(0, hasta[3])
            self.sikayet.delete("1.0", tk.END)
            self.sikayet.insert("1.0", hasta[4])
            self.tani.delete("1.0", tk.END)
            self.tani.insert("1.0", hasta[5])
        else:
            messagebox.showinfo("Bilgi", "Hasta bulunamadı!")

    def hasta_listesi_guncelle(self):
        for item in self.tree.get_children():
            self.tree.delete(item)

        conn = sqlite3.connect('hasta_takip.db')
        c = conn.cursor()
        c.execute("SELECT tc_no, ad_soyad, dogum_tarihi, telefon FROM hastalar")
        hastalar = c.fetchall()
        conn.close()

        for hasta in hastalar:
            self.tree.insert("", tk.END, values=hasta)

    def formu_temizle(self):
        self.tc_no.delete(0, tk.END)
        self.ad_soyad.delete(0, tk.END)
        self.dogum_tarihi.delete(0, tk.END)
        self.telefon.delete(0, tk.END)
        self.sikayet.delete("1.0", tk.END)
        self.tani.delete("1.0", tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = HastaTakipSistemi(root)
    root.mainloop() 