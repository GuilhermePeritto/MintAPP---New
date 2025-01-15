import { useReducer, useCallback } from 'react'

type Edit = {
  id: string
  field: string
  oldValue: any
  newValue: any
}

type State = {
  edits: Edit[]
  lastEdit: Edit | null
}

type Action =
  | { type: 'ADD_EDIT'; payload: Edit }
  | { type: 'UNDO_LAST_EDIT' }
  | { type: 'RESET_EDITS' }

const initialState: State = {
  edits: [],
  lastEdit: null
}

function editReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_EDIT':
      return {
        edits: [...state.edits, action.payload],
        lastEdit: action.payload
      }
    case 'UNDO_LAST_EDIT':
      const newEdits = state.edits.slice(0, -1)
      return {
        edits: newEdits,
        lastEdit: newEdits[newEdits.length - 1] || null
      }
    case 'RESET_EDITS':
      return initialState
    default:
      return state
  }
}

export function useEditTracker() {
  const [state, dispatch] = useReducer(editReducer, initialState)

  const addEdit = useCallback((edit: Omit<Edit, 'id'>) => {
    dispatch({
      type: 'ADD_EDIT',
      payload: { ...edit, id: Date.now().toString() }
    })
  }, [])

  const undoLastEdit = useCallback(() => {
    dispatch({ type: 'UNDO_LAST_EDIT' })
  }, [])

  const resetEdits = useCallback(() => {
    dispatch({ type: 'RESET_EDITS' })
  }, [])

  return {
    edits: state.edits,
    lastEdit: state.lastEdit,
    addEdit,
    undoLastEdit,
    resetEdits
  }
}

