import PropTypes from 'prop-types'

function SearchProducts({ searchValue, onChangeSearchInput }) {
  return (
    <label htmlFor="search" className='basis-full lg:basis-1/2'>
      <input
        type="search"
        placeholder="Cari di shopping"
        aria-label="Cari produk di shopping"
        onChange={(e) => onChangeSearchInput(e)}
        value={searchValue}
        autoComplete='off'
        spellCheck={false}
        id='search'
        className="shrink border-none w-full outline outline-1 outline-slate-400 rounded-xl py-1 px-3 sm:px-4 focus:outline-teal-500 focus:shadow-sm"
      />
    </label>
  )
}

SearchProducts.propTypes = {
  searchValue: PropTypes.string,
  onChangeSearchInput: PropTypes.func,
}

export default SearchProducts
