## Install
```
npm i
```

## Run
```
npm run start
```
go to http://localhost:8080

---

## Copy & Paste issues

The example contains one entity rendered by Snippet decorator.
When the whole entity is selected, C&P works as expected - the whole entity is copied (and thanks to `handleDraftEditorPastedText` the new entity got a new record in ContentState.entityMap).

### Whole entity is copied instead of selected text

1. select the whole text `This text comes from the entity data` (rendered by Snippet decorator)
2. Copy
3. Place cursor between `>>>` and `<<<`
4. Paste -> the whole entity is copied

The same happens when the whole text `Static text created by decorator` is selected.

### Nothing is copied instead of selected text

1. select any part of text "This text comes from the entity data" (e.g. only one word)
2. Copy
3. Place cursor between `>>>` and `<<<`
4. Paste -> nothing is copied, but `handleDraftEditorPastedText` returns a new EditorState
