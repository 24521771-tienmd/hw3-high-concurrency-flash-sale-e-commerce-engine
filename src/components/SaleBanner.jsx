
export default function SaleBanner() {
  return (
    <section className="sale-banner" id="home" aria-labelledby="sale-title">
      <div className="sale-banner-content">
        <p className="eyebrow">
          <span aria-hidden="true">⚡</span> THE BIGGEST DEAL OF THE DAY
        </p>

        <h1 id="sale-title">
          Big deals.
          <br />
          Small prices.
        </h1>

        <p className="sale-description">
          Your favorite tech essentials, at prices worth staying up for.
        </p>

        <a className="sale-cta" href="#products">
          Explore deals <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="sale-banner-visual" aria-hidden="true">
        <div className="sale-orbit sale-orbit-outer" />
        <div className="sale-orbit sale-orbit-inner" />
        <div className="sale-burst">FLASH<br />SALE</div>
        <span className="sale-spark sale-spark-one">✦</span>
        <span className="sale-spark sale-spark-two">✧</span>
        <span className="sale-spark sale-spark-three">✦</span>
      </div>
    </section>
  )
}
