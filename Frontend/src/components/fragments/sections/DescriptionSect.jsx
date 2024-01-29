import TitleSect from "../../elements/TitleSect"

function DescriptionSect() {
  return (
    <section className="md:basis-1/2 p-1 pt-3 bg-white rounded-md sm:p-4 lg:p-7 lg:rounded-lg">
      <TitleSect>Deskripsi produk</TitleSect>
      <article className="mt-2 pt-2 pb-1 border-t">
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui eum nihil minus, aliquid cumque quos voluptates dolorem ullam veritatis voluptas in ducimus velit, voluptate odio.</p>

        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid in placeat eum dolores quas nostrum quibusdam?</p>
      </article>
    </section>
  )
}

export default DescriptionSect