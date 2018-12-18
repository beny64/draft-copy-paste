import React from "react";
import ReactDOM from "react-dom";

import { Editor, EditorState, convertFromRaw, convertToRaw, CompositeDecorator } from "draft-js";
import {
    registerCopySource,
    handleDraftEditorPastedText,
  } from "draftjs-conductor";

import "./style.css";

const initial = {
    "blocks": [{
        "depth": 0,
        "key": "co9q8",
        "text": "---before---",
        "type": "unstyled"
    }, {
        "depth": 0,
        "entityRanges": [{
            "key": 0,
            "length": 1,
            "offset": 0
        }],
        "key": "3p8hv",
        "text": " ",
        "type": "atomic"
    }, {
        "depth": 0,
        "key": "64jnl",
        "text": "---after---",
        "type": "unstyled"
    }, {
        "depth": 0,
        "key": "64jnx",
        "text": "paste here >>> <<<",
        "type": "unstyled"
    }],
    "entityMap": {
        0: {
            "data": {
                "text": "This text comes from the entity data",
            },
            "mutability": "IMMUTABLE",
            "type": "SNIPPET"
        }
    }
};

const Snippet = ({ entityKey, contentState }) => {
    const { text } = contentState.getEntity(entityKey).getData();
    return (<div className="snippet" contentEditable={false}>
        Static text created by decorator
        <div contentEditable={false}>{text}</div>
    </div>);
};

const decorator = new CompositeDecorator([{
    strategy: (contentBlock, callback, contentState) => {
        contentBlock.findEntityRanges(
            (character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'SNIPPET'
                );
            },
            callback
        );
    },
    component: Snippet,
}]);

class MyEditor extends React.Component {
    state = {
        editorState: EditorState.createWithContent(convertFromRaw(initial), decorator),
    }

    componentDidMount() {
        this.copySource = registerCopySource(this.editorRef);
    }

    componentWillUnmount() {
        if (this.copySource) {
            this.copySource.unregister();
        }
    }

    handlePastedText = (text, html, editorState) => {
        let newState = handleDraftEditorPastedText(html, editorState);

        if (newState) {
            console.log("draftjs-conductor handleDraftEditorPastedText applied")
            this.onChange(newState);
            return true;
        }

        return false;
    };

    onChange = (editorState) => {
        console.log(convertToRaw(editorState.getCurrentContent()))
        this.setState({ editorState });
    };

    render() {
        return (<Editor
            ref={(ref) => {
                this.editorRef = ref;
            }}
            editorState={this.state.editorState}
            onChange={this.onChange}
            handlePastedText={this.handlePastedText}
        />);
    }
}

ReactDOM.render(<MyEditor />, document.getElementById("app"));
module.hot.accept();