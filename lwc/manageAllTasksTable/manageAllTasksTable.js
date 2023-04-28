import { LightningElement, api } from 'lwc';
export default class ManageAllTasksTable extends LightningElement {
    @api tasks;
    selectedTasks=[];
    draftValues = [];
    inputText;
    submitText = '';
    taskName;
    
    columns = [
        {label: 'Name', fieldName: 'Name'},
        {label: 'LOE', fieldName: 'Level_of_Effort__c'  },
        {label: 'Days', fieldName: 'taskDays', editable: true}
    ];

    handleInputChange(event){
        this.inputText = event.detail.value;
    }

    handleSearchClick(){
        this.submitText = this.inputText;
        console.log("in the handle click button");

        let eventPayload = {
            taskName: this.submitText,
        };

        const searchTasksEvent = new CustomEvent('searchtasks', {
            detail: eventPayload
        });
        this.dispatchEvent(searchTasksEvent);
    }

    handleSearchButton(event){
        if (event.keyCode === 13) {
            this.submitText = this.inputText;
            console.log("in the handle search button");
        }
    }

    

    async handleSave(event) {
        this.draftValues = event.detail.draftValues
        JSON.stringify(this.draftValues)
        console.log('draft values ',JSON.stringify(this.draftValues));
        const saveDaysEvent = new CustomEvent('savedays', {
        });
        this.dispatchEvent(saveDaysEvent); 
    }
    
    handleRowSelection(event) {
       let selectedRows = event.detail.selectedRows;
       this.selectedTasks = selectedRows;
        console.log('selected rows ', JSON.stringify(selectedRows));
    };


    assignSelectedTasks() {
        console.log('firing event');
        let eventPayload = {
            tasks: this.selectedTasks,
            tasksWithDays: this.draftValues
        };
        console.log('in table selected tasks', this.selectedTasks)
        console.log('event payload: ',eventPayload);
        const assignSelectedTasksEvent = new CustomEvent('assignselectedtasks', {
            detail: eventPayload
        });
        this.dispatchEvent(assignSelectedTasksEvent);
    }
}
