import PropTypes from 'prop-types'
import { WithContext as ReactTags } from 'react-tag-input';

function ReactTag({ data, handleTagAddition, handleTagDelete, handleDeleteTagInput, classNameDeleteLabel, classNameTitle }) {

  const KeyCodes = {
    comma: 188,
    enter: 13
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  return (
    <>
      {data.map((input, index) => (
        <div key={index}>
          <div className='flex items-end mb-2'>
            <span className={classNameTitle}>{input.label}</span>
            <button type="button" title={`Hapus label variasi ${input.label}`} onClick={() => handleDeleteTagInput(input.label, index)} aria-label='Hapus label variasi' className={classNameDeleteLabel}>Hapus label {input.label}</button>
          </div>
          <ReactTags
            tags={input.tags}
            placeholder="Tulis tag produkmu, lalu tekan enter"
            classNames={{
              tags: 'flex flex-col gap-3',
              tagInput: 'border rounded',
              tagInputField: 'w-full border-none outline-none py-1.5 px-4 rounded',
              tag: 'border bg-slate-100 shadow-sm pl-4 pb-[5px] rounded-md',
              remove: 'px-4 text-xl text-red-600 hover:text-red-500 hover:font-bold',
              selected: 'flex items-center justify-start flex-wrap gap-x-4 gap-y-2 mb-4'
            }}
            name='variasi produk'
            delimiters={delimiters}
            handleAddition={(tag) => handleTagAddition(index, tag)}
            handleDelete={(indexToDelete) => handleTagDelete(index, indexToDelete)}
            allowDragDrop={false}
            inputFieldPosition='top'
            inputProps={{
              title: `label ${input.label}`,
              "aria-label": `label ${input.label}`,
              name: `label ${input.label}`,
            }}
            autocomplete
          />
        </div>
      ))}
    </>
  )
}

ReactTag.propTypes = {
  data: PropTypes.array.isRequired,
  handleTagAddition: PropTypes.func.isRequired,
  handleTagDelete: PropTypes.func.isRequired,
  handleDeleteTagInput: PropTypes.func.isRequired,
  classNameDeleteLabel: PropTypes.string,
  classNameTitle: PropTypes.string,
}


export default ReactTag