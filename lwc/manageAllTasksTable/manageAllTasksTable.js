import { LightningElement, api } from 'lwc';

export default class ManageAllTasksTable extends LightningElement {
    @api tasks;
    selectedTasks=[];
    draftValues = [];
    
    columns = [
        {label: 'Name', fieldName: 'Name'},
        {label: 'LOE', fieldName: 'Level_of_Effort__c'  },
        {label: 'Days', fieldName: 'taskDays', editable: true}
    ];



    async handleSave(event) {
        this.draftValues = event.detail.draftValues
        JSON.stringify(this.draftValues)
        console.log('draft values ',JSON.stringify(this.draftValues));

       // let eventPayload = {

        //}


        const saveDaysEvent = new CustomEvent('savedays', {
          //  detail: eventPayload
        });

        //console.log('save payload',JSON.stringify(eventPayload));

        this.dispatchEvent(saveDaysEvent);

        this.dispatchEvent(new ShowToastEvent({
            title: 'Value Saved',
            message: 'Days value has been saved',
            variant: {label: 'success', value: 'success' },
        }));
        
    }

    
    handleRowSelection(event) {
       
       let selectedRows = event.detail.selectedRows;
       this.selectedTasks = selectedRows;

        //console.log('event ', JSON.stringify(event.detail));
        console.log('selected rows ', JSON.stringify(selectedRows));
        //console.log('draft values ',JSON.stringify(this.draftValues));
    };



    assignSelectedTasks() {
        console.log('firing event');
        let eventPayload = {
            tasks: this.selectedTasks,
            tasksWithDays: this.draftValues
        };
        console.log('event payload: ',eventPayload);

        const assignSelectedTasksEvent = new CustomEvent('assignselectedtasks', {
            detail: eventPayload
        });

        this.dispatchEvent(assignSelectedTasksEvent);
    }


}
