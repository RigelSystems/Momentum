<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import ChecklistItemForm from '@/components/checklist_items/ChecklistItemForm.vue'
import ChecklistItemCellForm from '@/components/checklist_item_cells/ChecklistItemCellForm.vue';
import ChecklistItemCellTitle from '@/components/checklist_item_cells/ChecklistItemCellTitle.vue';
import ChecklistItemCellText from '@/components/checklist_item_cells/ChecklistItemCellText.vue';
import ChecklistItemCellRating from '@/components/checklist_item_cells/ChecklistItemCellRating.vue';
import ChecklistItemCellImage from '@/components/checklist_item_cells/ChecklistItemCellImage.vue';
import ChecklistItemCellToggle from '@/components/checklist_item_cells/ChecklistItemCellToggle.vue';
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
  },
  setup(props, { emit }) {
    const creatingNewCell = ref('')
    const editMode = ref(false)
    const { accessToken } = useAuthToken()
    const handleSave = () => {
      console.log('saved from checklist item')
      emit('save')
    }

    const checklistItemBulkUpdateUrl = computed(() => {
      return `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItem.id}/checklist_item_cells`
    })

    return {
      handleSave,
      creatingNewCell,
      checklistItemBulkUpdateUrl,
      accessToken,
      editMode,
    }
  },
});
</script>

<template>
  <div class="n-container-style checklist-item-wrapper">
    <div class="checklist-item-edit-mode-buttons">
      <span v-if="!editMode" @click="editMode = true" class="mdi mdi-square-edit-outline clickable"></span>
      <span v-if="editMode" @click="editMode = false" class="mdi mdi-check clickable"></span>
    </div>
    

    <n-order-list
      :items="checklistItem.checklist_item_cells"
      modelName="checklist_item_cells"
      :updateUrl="checklistItemBulkUpdateUrl"
      :accessToken="accessToken"
    >
      <template #default="cell">
        <component 
          :is="`ChecklistItemCell${cell.cell_type}`" 
          :checklistItemId="checklistItem.id"
          :cell="cell.cellable" 
          :editMode="editMode"
        />
      </template>
    </n-order-list>

    <div class="cell-container-buttons" v-if="editMode">
      <button @click="creatingNewCell = 'Title'"><span class="mdi mdi-format-title"></span></button>
      <button @click="creatingNewCell = 'Text'"><span class="mdi mdi-format-text"></span></button>
      <button @click="creatingNewCell = 'Rating'"><span class="mdi mdi-star"></span></button>
      <button @click="creatingNewCell = 'Image'"><span class="mdi mdi-image"></span></button>
      <button @click="creatingNewCell = 'Toggle'"><span class="mdi mdi-toggle-switch"></span></button>
    </div>

    <component
      v-if="creatingNewCell"
      :is="`ChecklistItemCell${creatingNewCell}`" 
      :checklistItemId="checklistItem.id" 
      :editMode="editMode"
      :cell="{}"
      @save="handleSave"
    />
  </div>
</template>

<style>
.checklist-item-wrapper {
  position: relative;
  padding-right: 2rem;
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

.cell-container-buttons button {
  border: solid grey 1px;
  border-radius: 5px;
  cursor: pointer;
  color: black;
  height: 40px;
  width: 40px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.cell-container-buttons button:hover {
  background-color: #f0f0f0;
}
</style>
