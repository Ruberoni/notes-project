import { useNoteContext } from '../../context'

export default function useNoteItem(): any {
    const noteContext = useNoteContext()

    function handleNoteClick(noteData: any) {
        noteContext.setCurrentNote(noteData)
    }
    return [handleNoteClick]
}