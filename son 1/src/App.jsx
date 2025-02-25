import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hastalar, setHastalar] = useState([]);
  const [arsivlenenHastalar, setArsivlenenHastalar] = useState([]);
  const [formVerileri, setFormVerileri] = useState({
    hastaAdi: '',
    hastaOnayTarihi: '',
    teknisyen: '',
    kalanSure: '',
    aciklama: '',
    teslimatTarihi: '',
  });
  const [duzenlemeIndex, setDuzenlemeIndex] = useState(null);

  useEffect(() => {
    if (formVerileri.kalanSure) {
      const bugun = new Date();
      bugun.setDate(bugun.getDate() + parseInt(formVerileri.kalanSure, 10));
      const yil = bugun.getFullYear();
      const ay = String(bugun.getMonth() + 1).padStart(2, '0');
      const gun = String(bugun.getDate()).padStart(2, '0');
      setFormVerileri(prev => ({
        ...prev,
        teslimatTarihi: `${yil}-${ay}-${gun}`
      }));
    } else {
      setFormVerileri(prev => ({
        ...prev,
        teslimatTarihi: ''
      }));
    }
  }, [formVerileri.kalanSure]);

  const handleChange = (e) => {
    setFormVerileri({ ...formVerileri, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (duzenlemeIndex === null) {
      setHastalar([...hastalar, formVerileri]);
    } else {
      const guncellenmisHastalar = [...hastalar];
      guncellenmisHastalar[duzenlemeIndex] = formVerileri;
      setHastalar(guncellenmisHastalar);
      setDuzenlemeIndex(null);
    }
    setFormVerileri({
      hastaAdi: '',
      hastaOnayTarihi: '',
      teknisyen: '',
      kalanSure: '',
      aciklama: '',
      teslimatTarihi: '',
    });
  };

  const handleDuzenle = (index) => {
    setFormVerileri(hastalar[index]);
    setDuzenlemeIndex(index);
  };

  const handleSil = (index) => {
    const yeniHastalar = [...hastalar];
    yeniHastalar.splice(index, 1);
    setHastalar(yeniHastalar);
  };

  const handleArsivle = (index) => {
    const arsivlenecekHasta = hastalar[index];
    setArsivlenenHastalar([...arsivlenenHastalar, arsivlenecekHasta]);
    handleSil(index);
  };

  const siralanmisHastalar = [...hastalar].sort((a, b) => {
    const kalanSureA = parseInt(a.kalanSure, 10);
    const kalanSureB = parseInt(b.kalanSure, 10);

    if (isNaN(kalanSureA) && isNaN(kalanSureB)) {
      return 0;
    } else if (isNaN(kalanSureA)) {
      return 1;
    } else if (isNaN(kalanSureB)) {
      return -1;
    } else {
      return kalanSureA - kalanSureB;
    }
  });

  return (
    <div className="App">
      <h1>Laboratuvar Hasta Takip Sistemi</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hastaAdi">Hasta Adı:</label>
            <input
              type="text"
              id="hastaAdi"
              name="hastaAdi"
              value={formVerileri.hastaAdi}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hastaOnayTarihi">Hasta Onay Tarihi:</label>
            <input
              type="date"
              id="hastaOnayTarihi"
              name="hastaOnayTarihi"
              value={formVerileri.hastaOnayTarihi}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="teknisyen">Teknisyen:</label>
            <input
              type="text"
              id="teknisyen"
              name="teknisyen"
              value={formVerileri.teknisyen}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="kalanSure">Kalan Süre:</label>
            <input
              type="number"
              id="kalanSure"
              name="kalanSure"
              value={formVerileri.kalanSure}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="teslimatTarihi">Teslimat Tarihi:</label>
            <input
              type="date"
              id="teslimatTarihi"
              name="teslimatTarihi"
              value={formVerileri.teslimatTarihi}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="aciklama">Açıklama:</label>
            <textarea
              id="aciklama"
              name="aciklama"
              value={formVerileri.aciklama}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <button type="submit">{duzenlemeIndex === null ? 'Hasta Ekle' : 'Güncelle'}</button>
      </form>

      <h2>Hasta Listesi</h2>
      <table>
        <thead>
          <tr>
            <th>Sıra No</th>
            <th>Hasta Adı</th>
            <th>Hasta Onay Tarihi</th>
            <th>Teknisyen</th>
            <th>Kalan Süre</th>
            <th>Teslimat Tarihi</th>
            <th>Açıklama</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {siralanmisHastalar.map((hasta, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{hasta.hastaAdi}</td>
              <td>{hasta.hastaOnayTarihi}</td>
              <td>{hasta.teknisyen}</td>
              <td>{hasta.kalanSure}</td>
              <td>{hasta.teslimatTarihi}</td>
              <td>{hasta.aciklama}</td>
              <td>
                <button onClick={() => handleDuzenle(index)}>Düzenle</button>
                <button onClick={() => handleArsivle(index)}>Arşivle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Arşivlenen Hastalar</h2>
      <table>
        <thead>
          <tr>
            <th>Sıra No</th>
            <th>Hasta Adı</th>
            <th>Hasta Onay Tarihi</th>
            <th>Teknisyen</th>
            <th>Kalan Süre</th>
            <th>Teslimat Tarihi</th>
            <th>Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {arsivlenenHastalar.map((hasta, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{hasta.hastaAdi}</td>
              <td>{hasta.hastaOnayTarihi}</td>
              <td>{hasta.teknisyen}</td>
              <td>{hasta.kalanSure}</td>
              <td>{hasta.teslimatTarihi}</td>
              <td>{hasta.aciklama}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
