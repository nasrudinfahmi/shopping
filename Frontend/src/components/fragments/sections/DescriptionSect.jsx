import PropTypes from 'prop-types'
import TitleSect from "../../elements/TitleSect"
import parse from 'html-react-parser';
import { useState } from 'react';

function DescriptionSect({ product }) {
  const [isMinimize, setMinimize] = useState(true)

  const handleClick = () => {
    setMinimize(!isMinimize)
  }

  return (
    <section className="flex flex-col md:basis-1/2 p-1 pt-3 bg-white rounded-md sm:p-4 lg:p-7 lg:rounded-lg">
      <TitleSect>Deskripsi produk</TitleSect>
      <article className={`mt-2 pt-2 pb-1 border-t overflow-hidden ${isMinimize ? 'max-h-44' : ''}`}>
        {!product.descriptions && (
          '-'
        )}
        {product.descriptions && product.descriptions.map((desc, index) => (
          <div key={index}>
            {desc.type === 'paragraph' && <p className={`${desc.alignment === 'center' ? 'text-center' : 'text-left'}`}>{parse(desc.text)}</p>}
            {desc.type === 'list' && desc.style === 'ordered' && (
              <ol className='list-decimal list-inside'>
                {desc.items.map(item => <li key={item}>{parse(item)}</li>)}
              </ol>
            )}
            {desc.type === 'list' && desc.style === 'unordered' && (
              <ul className='list-disc list-inside'>
                {desc.items.map(item => <li key={item}>{parse(item)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </article>
      {!product.descriptions === '-' || product.descriptions && (
        <button
          type="button"
          onClick={handleClick}
          className='bg-transparent mt-5 ml-auto px-3 py-1 text-slate-700 font-medium hover:text-orange-900'
          aria-label={`tampilkan deskripsi ${isMinimize ? 'lengkap' : 'sedikit'}`}
          title={isMinimize ? 'Lebih banyak' : 'Lebih sedikit'}>{isMinimize ? 'Lebih banyak' : 'Lebih sedikit'}</button>
      )}
    </section>
  )
}

DescriptionSect.propTypes = {
  product: PropTypes.object.isRequired,
}

export default DescriptionSect