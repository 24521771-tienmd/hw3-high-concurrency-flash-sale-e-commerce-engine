
import FlashSaleHeader from './components/FlashSaleHeader'
import SaleBanner from './components/SaleBanner'
import CountdownTimer from './components/CountdownTimer'
import ProductCard from './components/ProductCard'
import { products } from './data/products'
import useFlashSaleInventory from './hooks/useFlashSaleInventory'
import './App.css'

export default function App() {
  const { inventory, message, reserve, checkout } =
    useFlashSaleInventory(products)

  return (
    <div className="app-shell">
      <FlashSaleHeader />

      <main>
        <SaleBanner />

        <section className="deals-section" id="deals">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LIMITED-TIME OFFERS</p>
              <h2>Flash deals</h2>
              <p className="section-description">
                The clock is ticking. Grab your favorites before they're gone.
              </p>
            </div>

            <CountdownTimer />
          </div>

          {message && (
            <p className="inventory-message" role="status">
              {message}
            </p>
          )}

          <div className="product-grid" id="products">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                inventory={inventory[product.id]}
                onReserve={() => reserve(product.id)}
                onCheckout={checkout}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>FlashMart — Demo storefront for a flash-sale experience.</p>
      </footer>
    </div>
  )
}
