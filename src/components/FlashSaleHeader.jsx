
export default function FlashSaleHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="FlashMart home">
        <span className="brand-mark" aria-hidden="true">
          F
        </span>
        <span className="brand-name">FlashMart</span>
      </a>

      <nav className="header-nav" aria-label="Main navigation">
        <a href="#deals">Flash Sale</a>
        <a href="#products">Products</a>
      </nav>

      <div className="header-status">
        <span className="status-dot" aria-hidden="true" />
        <span>Live deals</span>
      </div>
    </header>
  )
}
