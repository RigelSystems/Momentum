<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import ChecklistItemForm from '@/components/checklist_items/ChecklistItemForm.vue'
import ChecklistItemCellForm from '@/components/checklist_item_cells/ChecklistItemCellForm.vue';
import ChecklistItemCellTitle from '@/components/checklist_item_cells/ChecklistItemCellTitle.vue';
import ChecklistItemCellText from '@/components/checklist_item_cells/ChecklistItemCellText.vue';
import ChecklistItemCellRating from '@/components/checklist_item_cells/ChecklistItemCellRating.vue';
import ChecklistItemCellImage from '@/components/checklist_item_cells/ChecklistItemCellImage.vue';
import ChecklistItemCellToggle from '@/components/checklist_item_cells/ChecklistItemCellToggle.vue';
import DeleteCell from '@/components/checklist_item_cells/DeleteCell.vue';
import { useAuthToken } from '@/composables/useAuthToken'

export interface ChecklistItem {
  id?: number,
  name: string,
  icon: string,
  checklist_id: number,
  checklist_item_type?: string[],
  checklist_item_cells?: ChecklistItemCell[],
}

export interface ChecklistItemCell {
  id?: number,
  name: string,
  cell_type: string,
  content?: string,
  label?: string,
  cellable?: any,
}

export default defineComponent({
  name: 'ChecklistItem',
  props: {
    checklistItem: {
      type: Object as () => ChecklistItem,
      required: true,
    },
  },
  components: {
    ChecklistItemForm,
    ChecklistItemCellForm,
    ChecklistItemCellTitle,
    ChecklistItemCellText,
    ChecklistItemCellRating,
    ChecklistItemCellImage,
    ChecklistItemCellToggle,
    DeleteCell,
  },
  setup(props, { emit }) {
    const creatingNewCell = ref('')
    const editMode = ref(false)
    const { accessToken } = useAuthToken()
    const checklistItemCells = ref([])
    const handleSave = () => {
      fetchChecklistItem()
      creatingNewCell.value = ''
    }
    
    const handleDelete = () => {
      fetchChecklistItem()
    }

    const checklistItemBulkUpdateUrl = computed(() => {
      return `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItem.id}/checklist_item_cells`
    })

    const checklistItemCellsBulkUpdateUrl = computed(() => {
      return `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItem.id}/reorder`
    })

    const fetchChecklistItem = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItem.id}/checklist_item_cells`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      const data = await response.json()
      checklistItemCells.value = data
    }

    watch(accessToken, () => {
      fetchChecklistItem()
    })

    return {
      handleSave,
      checklistItemCells,
      creatingNewCell,
      checklistItemBulkUpdateUrl,
      checklistItemCellsBulkUpdateUrl,
      accessToken,
      editMode,
      handleDelete,
    }
  },
});
</script>

<template>
  <div class="n-container-style checklist-item-wrapper">
    <div class="checklist-item-edit-mode-buttons">
      <span v-if="!editMode" @click="editMode = true" class="mdi mdi-pencil clickable"></span>
      <span v-if="editMode" @click="editMode = false" class="mdi mdi-check clickable"></span>
    </div>
    

    <n-order-list
      :items="checklistItemCells"
      modelName="checklist_item_cells"
      :updateUrl="checklistItemCellsBulkUpdateUrl"
      :accessToken="accessToken"
      :class="{ 'checklist-item-wrapper--edit': editMode }"
    >
      <template #default="cell">
        <div :class="['checklist-item-cell-wrapper', { 'checklist-item-cell-wrapper--edit': editMode }]">
          <div class="checklist-item-cell-wrapper__content">
            <span class="mdi mdi-drag-horizontal-variant" v-if="editMode"></span>
            <component 
              :is="`ChecklistItemCell${cell.cell_type}`" 
              :checklistItemId="checklistItem.id"
              :cell="cell" 
              :editMode="editMode"
              @delete="handleDelete"
            />
          </div>
          <DeleteCell :checklistItemId="checklistItem.id" :cellId="cell.id" @delete="handleDelete" v-if="editMode"/>
        </div>
      </template>
    </n-order-list>

    <div class="cell-container-buttons" v-if="editMode">
      <select v-model="creatingNewCell" class="cell-type-select">
        <option value="">Add new cell...</option>
        <option value="Title">Title</option>
        <option value="Text">Text</option>
        <option value="Rating">Rating</option>
        <option value="Image">Image</option>
        <option value="Toggle">Toggle</option>
      </select>
    </div>

    <component
      v-if="creatingNewCell"
      :is="`ChecklistItemCell${creatingNewCell}`" 
      :checklistItemId="checklistItem.id" 
      :editMode="editMode"
      :cell="{}"
      @save="handleSave"
      class="new-cell-form"
    />
  </div>
</template>

<style>
.checklist-item-cell-wrapper__content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.checklist-item-cell-wrapper--edit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border: solid 1px rgb(217, 217, 217);
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.new-cell-form input,
.new-cell-form textarea {
  border: solid 1px rgb(217, 217, 217) !important;
  border-radius: 5px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.checklist-item-wrapper {
  position: relative;
  padding-right: 2rem;
}

.n-order-list__list-item {
  margin-bottom: 0.5rem;
}

.checklist-item-edit-mode-buttons {
  position: absolute;
  top: 0;
  right: 5px;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: #f0f0f0;
  border: solid 1px #f0f0f0;
}

.checklist-item-wrapper .n-order-list__list-item {
  padding: 0 !important;
}

.cell-container-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.cell-type-select {
  padding: 8px;
  border: solid grey 1px;
  border-radius: 5px;
  cursor: pointer;
  color: black;
  min-width: 150px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.cell-type-select:hover {
  background-color: #f0f0f0;
}
</style>
