import { LightningElement, api, track, wire } from 'lwc';
import getCases from '@salesforce/apex/caseViewerController.getCases';
import closeCases from '@salesforce/apex/caseViewerController.closeCases';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const columns = [
    {label: 'Subject', fieldName: 'Subject'},
    {label: 'Priority', fieldName: 'Priority'},
    {label: 'Status', fieldName: 'Status'},
    {label: 'Duration (Days)', fieldName: 'Duration_in_Days__c'},
];


export default class CaseViewer extends LightningElement {

    @api recordId;
    columns = columns;
    wiredCases;
    hasCases = false;
    selectedCases;
    variant = 'success';
   
@wire(getCases, {relatedAccountId: '$recordId'})
wiredCases(response){
       if (response.data) {
            this.wiredCases = response.data;
            if (this.wiredCases.length > 0) {
                this.hasCases = true;
            }
            
            this.error = undefined;
            console.log('cases found: '+ this.wiredCases);
        } else if (response.error) {
            this.error = response.error;
            this.wiredCases = undefined;
            console.log('error getting cases: '+ this.error)
        }
};

    handleCloseCases(){ 
        console.log('in the case close method. '+ JSON.stringify(this.selectedCases));
        closeCases ({openCases: this.selectedCases})
        .then(result => {
                console.log('case closed.');
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!',
                    message: 'Case Closed',
                    variant: this.variant
                    
                }));
                    
        })
        .catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Please contact your administrator',
                variant: 'error'
            }));
            console.log("close case error: "+ error.body.message);
        });
       
    }

    
    handleRowSelection(event){
            this.selectedCases = event.detail.selectedRows;
            console.log('selected cases: '+ JSON.stringify(this.selectedCases));
    }


}
