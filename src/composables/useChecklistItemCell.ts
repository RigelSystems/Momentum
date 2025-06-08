import { useAuthToken } from './useAuthToken'

export interface Cell {
  id?: number;
  cellable?: {
    id: number;
    content: string;
  };
  content?: string;
  label?: string;
  value?: boolean | number;
  image_url?: string;
}

export function useChecklistItemCell(props: { checklistItemId: number, cell: Cell, cellType: string }) {
  const { accessToken } = useAuthToken()

  const createCell = (data: any) => {
    const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_${props.cellType}s`
    const requestData = {
      checklist_item_cell: data,
    }
    return fetch(save_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(requestData),
    })
  }

  const updateCell = (data: any) => {
    const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_${props.cellType}s/${props.cell.id}`
    const requestData = {
      checklist_item_cell: data,
    }
    return fetch(save_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(requestData),
    })
  }

  const deleteCell = () => {
    const delete_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cells/${props.cell.id}`
    return fetch(delete_url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
      },
    })
  }

  return {
    createCell,
    updateCell,
    deleteCell,
  }
} 