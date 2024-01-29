import TitleSect from '../../elements/TitleSect'

function DetailSect() {
  return (
    <section className="md:basis-1/2 p-1 pt-3 mt-6 md:mt-0 bg-white rounded-md sm:p-4 lg:p-7 lg:rounded-lg">
      <TitleSect>Detail produk</TitleSect>
      <section className="grid grid-cols-3 mt-2 pt-2 pb-1 border-t">
        <div className="col-span-1 flex flex-col gap-1 *:line-clamp-1">
          <span>Produk</span>
          <span>Merek</span>
          <span>Harga</span>
          <span>Status</span>
          <span>Pengiriman</span>
          <span>Toko</span>
        </div>
        <div className="col-span-2 flex flex-col gap-1 *:line-clamp-1">
          <span>Baju Sangat Bagus</span>
          <span>Baju besi</span>
          <span>Rp. 215.000</span>
          <span>Ready</span>
          <span>Surabaya</span>
          <span>Tokobaju</span>
        </div>
      </section>
    </section>
  )
}

export default DetailSect