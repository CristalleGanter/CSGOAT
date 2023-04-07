import { LightningElement, api, wire } from 'lwc';
import getRelatedTasks from '@salesforce/apex/ManageAllTasksController.getRelatedTasks';
import assignTasksToProject from '@salesforce/apex/ManageAllTasksController.assignTasksToProject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { CloseActionScreenEvent } from 'lightning/actions';
export default class ManageAllTasksContainer extends LightningElement {
    @api recordId;
    tasksWithDays;
    tasks;
    tasksResult;
    variant = 'success';



    @wire(getRelatedTasks, { projectId: '$recordId' })
    wiredTasks(response) {
        this.tasksResult = response;
        console.log("get related tasks ", response.data);
        if(response.data) {
            this.tasks = response.data;
            this.error = undefined;
        }
        else if(response.error) {
            this.error = response.error;
            this.tasks = undefined;
        }
    }

    handleSave(){
        this.dispatchEvent(new ShowToastEvent({
            title: 'Value Saved',
            message: 'Days value has been saved',
            variant: 'success',
        }));

    }


    handleAssignTasks(event) {
        console.log('handling event');
        let tasksToBeAssigned = event.detail.tasks;
        let taskAndDates = event.detail.tasksWithDays;
        var taskMap = {};
        console.log("about to assign map");
        for (var i = 0; i < tasksToBeAssigned.length; i++){
            if (taskAndDates[i]){
                taskMap[tasksToBeAssigned[i].Id] = taskAndDates[i].taskDays;
            }
            else {
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: 'Missing Data',
                    message: 'Please enter a value in the Days column and click save',
                    variant: 'error'
                    }))
                return;
            }
        }

        console.log('TASK MAP ', JSON.parse(JSON.stringify(taskMap)));
        console.log('tasks to be assigned');
        console.log(JSON.parse(JSON.stringify(tasksToBeAssigned)));

        console.log('TASKS WITH DATES');
        console.log(JSON.parse(JSON.stringify(taskAndDates)));

        
       assignTasksToProject({projectId: this.recordId, taskWithDates: taskMap })
            .then(result => {
                console.log('assignment successful');
                return refreshApex(this.tasksResult);
            })
            .catch(error => {
                console.warn(error);
            });

            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!',
                message: 'Tasks assigned successfully!',
                variant: this.variant
            }));
            this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!',
            message: 'Task ' + event.detail.id + ' assigned successfully!',
            variant: {label: 'success', value: 'success' },
        }));
    }
}