import React, { useState, useMemo } from 'react';
import './App.css';

// --- TİP TANIMLARI ---
interface Product {
  id: number;
  category: 'Boxer' | 'Atlet' | 'Termal' | 'Tayt' | 'Diğer'; // Kategori eklendi
  name: string;
  code: string;
  colors: string;
  sizes: string;
  stock: number;
  price: number;
  icon: string;
}

// --- VERİTABANI (BAŞLANGIÇ VERİLERİ) ---
const initialData: Product[] = [
  // BOXER GRUBU
  { id: 1, category: 'Boxer', name: "ERKEK EMPİRME BOXER", code: "1100", colors: "Tek Renk", sizes: "S-XXL", stock: 150, price: 150, icon: "fa-box-open" },
  { id: 2, category: 'Boxer', name: "ERKEK EMPİRME BATTAL", code: "1101", colors: "Tek Renk", sizes: "3XL-8XL", stock: 40, price: 180, icon: "fa-box-open" },
  { id: 3, category: 'Boxer', name: "ERKEK PENYE KLASİK", code: "1110", colors: "Karışık", sizes: "S-XXL", stock: 200, price: 160, icon: "fa-box-open" },
  { id: 4, category: 'Boxer', name: "ERKEK PENYE BATTAL", code: "1111", colors: "Karışık", sizes: "3XL-5XL", stock: 25, price: 190, icon: "fa-box-open" },
  { id: 5, category: 'Boxer', name: "ERKEK POPLİN BOXER", code: "1112", colors: "Tek Renk", sizes: "S-XXL", stock: 80, price: 175, icon: "fa-box-open" },
  { id: 6, category: 'Boxer', name: "ERKEK DÜZ RENK", code: "1115", colors: "Siyah, Gri", sizes: "S-XXL", stock: 120, price: 155, icon: "fa-box-open" },
  { id: 7, category: 'Boxer', name: "ERKEK LYCRA TORBALI", code: "1125", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 90, price: 170, icon: "fa-box-open" },
  { id: 8, category: 'Boxer', name: "ERKEK BAMBU BOXER", code: "1126", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 60, price: 210, icon: "fa-leaf" },
  { id: 9, category: 'Boxer', name: "ERKEK LYCRA DÜĞMELİ", code: "1135", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 55, price: 175, icon: "fa-box-open" },
  { id: 10, category: 'Boxer', name: "ERKEK LYCRA SLİP", code: "1140", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 100, price: 130, icon: "fa-box-open" },
  { id: 11, category: 'Boxer', name: "ERKEK LYCRA UZUN", code: "1150", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 45, price: 180, icon: "fa-box-open" },
  { id: 12, category: 'Boxer', name: "BATTAL LYCRA UZUN", code: "1151", colors: "Siyah, Beyaz", sizes: "3XL-5XL", stock: 20, price: 200, icon: "fa-box-open" },
  
  // ATLET & İÇLİK GRUBU
  { id: 14, category: 'Atlet', name: "İNTERLOK ALT İÇLİK", code: "1190", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 75, price: 250, icon: "fa-person-hiking" },
  { id: 15, category: 'Atlet', name: "LYCRA ALT İÇLİK", code: "1195", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 80, price: 240, icon: "fa-person-hiking" },
  { id: 16, category: 'Atlet', name: "ERKEK LYCRA ATLET", code: "1210", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 150, price: 110, icon: "fa-shirt" },
  { id: 17, category: 'Atlet', name: "ERKEK BAMBU ATLET", code: "1211", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 50, price: 150, icon: "fa-leaf" },
  { id: 18, category: 'Atlet', name: "LYCRA SPORCU ATLET", code: "1220", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 65, price: 120, icon: "fa-dumbbell" },
  { id: 19, category: 'Atlet', name: "LYCRA SIFIR KOL", code: "1230", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 95, price: 115, icon: "fa-shirt" },
  { id: 21, category: 'Atlet', name: "LYCRA YARIM KOL", code: "1240", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 110, price: 140, icon: "fa-shirt" },
  { id: 23, category: 'Atlet', name: "LYCRA UZUN KOL", code: "1250", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 60, price: 160, icon: "fa-shirt" },
  { id: 24, category: 'Atlet', name: "LYCRA BALIKÇI YAKA", code: "1251", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 25, price: 170, icon: "fa-user" },
  { id: 27, category: 'Atlet', name: "ASKILI PENYE ATLET", code: "1410", colors: "Tek Renk", sizes: "S-XXL", stock: 200, price: 90, icon: "fa-shirt" },
  
  // TERMAL GRUBU
  { id: 29, category: 'Termal', name: "THERMAL ALT İÇLİK", code: "1510", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 15, price: 350, icon: "fa-temperature-arrow-down" },
  { id: 30, category: 'Termal', name: "THERMAL ÜST İÇLİK", code: "1520", colors: "Siyah, Beyaz", sizes: "S-XXL", stock: 18, price: 350, icon: "fa-temperature-arrow-down" },
  
  // KADIN / TAYT GRUBU
  { id: 31, category: 'Tayt', name: "BAYAN LYCRA UZUN", code: "2190", colors: "Ten, Gri, Siyah", sizes: "S-3XL", stock: 100, price: 200, icon: "fa-person-dress" },
  { id: 32, category: 'Tayt', name: "BAYAN LYCRA KAPRI", code: "2191", colors: "Ten, Gri, Siyah", sizes: "S-3XL", stock: 85, price: 180, icon: "fa-person-dress" },
  { id: 33, category: 'Tayt', name: "BAYAN LYCRA KISA", code: "2195", colors: "Ten, Gri, Siyah", sizes: "S-3XL", stock: 60, price: 160, icon: "fa-person-dress" },
  { id: 34, category: 'Tayt', name: "BAYAN KIŞLIK TAYT", code: "2199", colors: "Siyah, Gri", sizes: "S-XXL", stock: 5, price: 250, icon: "fa-snowflake" }
];

function App() {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  // --- STOK GÜNCELLEME ---
  const updateStock = (id: number, amount: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p
    ));
  };

  // --- FİLTRELEME MANTIĞI ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Kategori Filtresi
      const categoryMatch = selectedCategory === "Tümü" || product.category === selectedCategory;
      // 2. Arama Filtresi (İsim veya Kod)
      const searchLower = searchTerm.toLocaleLowerCase('tr');
      const nameMatch = product.name.toLocaleLowerCase('tr').includes(searchLower);
      const codeMatch = product.code.toLowerCase().includes(searchLower);
      
      return categoryMatch && (nameMatch || codeMatch);
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="App">
      {/* SOL MENÜ */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <i className="fa-solid fa-boxes-stacked"></i> Stok v2.0
        </div>
        <ul className="menu-items">
          <li className="active"><i className="fa-solid fa-table-columns"></i> Panel</li>
          <li><i className="fa-solid fa-list"></i> Ürünler</li>
          <li><i className="fa-solid fa-chart-pie"></i> Raporlar</li>
        </ul>
      </nav>

      {/* ANA İÇERİK */}
      <div className="main-content">
        <header>
          <div className="header-title"><h2>Ürün Yönetimi</h2></div>
          <div className="user-info"><span>Admin</span><i className="fa-solid fa-circle-user fa-xl"></i></div>
        </header>

        <div className="content-padding">
          {/* İSTATİSTİKLER */}
          <div className="stats-cards">
            <div className="stat-card">
              <div><h3>Toplam Çeşit</h3><p className="stat-num">{filteredProducts.length}</p></div>
              <i className="fa-solid fa-box fa-2x" style={{color:'#3498db'}}></i>
            </div>
            <div className="stat-card">
              <div><h3>Kritik Stok</h3><p className="stat-num">{products.filter(p=>p.stock<10).length}</p></div>
              <i className="fa-solid fa-triangle-exclamation fa-2x" style={{color:'#e74c3c'}}></i>
            </div>
            <div className="stat-card">
              <div><h3>Toplam Adet</h3><p className="stat-num">{products.reduce((a,b)=>a+b.stock,0)}</p></div>
              <i className="fa-solid fa-layer-group fa-2x" style={{color:'#27ae60'}}></i>
            </div>
          </div>

          {/* --- FİLTRE VE ARAMA ALANI (YENİ) --- */}
          <div className="filter-bar">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Ürün adı veya kodu ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-buttons">
              {['Tümü', 'Boxer', 'Atlet', 'Tayt', 'Termal'].map(cat => (
                <button 
                  key={cat}
                  className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ÜRÜN LİSTESİ */}
          <div className="product-grid">
            {filteredProducts.map((product) => {
              let stockClass = "stock-high";
              if (product.stock < 10) stockClass = "stock-low";
              else if (product.stock < 50) stockClass = "stock-medium";

              return (
                <div key={product.id} className="product-card">
                  <div className="card-header"><i className={`fa-solid ${product.icon}`}></i></div>
                  <div className="card-body">
                    <div className="product-code">{product.code}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-meta">
                      <span><i className="fa-solid fa-palette"></i> {product.colors}</span>
                      <span><i className="fa-solid fa-ruler-combined"></i> {product.sizes}</span>
                    </div>
                    
                    <div className="stock-control-area">
                      <div className="stock-buttons">
                        <button className="btn-stock minus" onClick={()=>updateStock(product.id, -1)}><i className="fa-solid fa-minus"></i></button>
                        <span className={`stock-badge ${stockClass}`}>{product.stock} Adet</span>
                        <button className="btn-stock plus" onClick={()=>updateStock(product.id, 1)}><i className="fa-solid fa-plus"></i></button>
                      </div>
                      <div className="price">{product.price} ₺</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredProducts.length === 0 && (
            <div style={{textAlign: 'center', padding: '20px', color: '#777'}}>
              <i className="fa-solid fa-filter-circle-xmark fa-2x"></i>
              <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
