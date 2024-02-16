import PropTypes from "prop-types";
import { createContext, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Underline from "@editorjs/underline";
import Strikethrough from "@sotaproject/strikethrough";
import ChangeCase from "editorjs-change-case";
// import InlineTool from 'editorjs-inline-tool'
import AlignmentBlockTune from "editorjs-text-alignment-blocktune";
import Tooltip from "editorjs-tooltip";
import Undo from "editorjs-undo";

export const EditorContext = createContext(null);

export default function EditorContextProvider({ children }) {
  const editorInstanceRef = useRef(null);

  const initEditor = (defaultValue) => {
    const blocks = defaultValue ? defaultValue : null

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Deskripsi produk",
      tools: {
        textAlignment: {
          class: AlignmentBlockTune,
          config: { default: "left" },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          tunes: ["textAlignment"],
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: { defaultStyle: "unordered" },
        },
        Marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },
        underline: Underline,
        strikethrough: Strikethrough,
        changeCase: {
          class: ChangeCase,
          config: {
            showLocaleOption: true,
            locale: "tr",
          },
        },
        tooltip: {
          class: Tooltip,
          config: {
            location: "left",
            highlightColor: "#FFEFD5",
            underline: true,
            backgroundColor: "#154360",
            textColor: "#FDFEFE",
            holder: "editorjs",
          },
        },
      },
      data: { blocks },
      minHeight: 100,
      onReady: () => {
        const config = {
          shortcuts: {
            undo: "CMD+Z",
            redo: "CMD+Y",
          },
        };

        new Undo({ editor, config });
      },
    });

    editorInstanceRef.current = editor;
  };

  return (
    <EditorContext.Provider value={{ initEditor, editorInstanceRef }}>
      {children}
    </EditorContext.Provider>
  );
}

EditorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};