import { LightningElement, api, track } from 'lwc';
import GET_CASES from '@salesforce/apex/caseViewerController.getCases';

const columns = [
    {label: 'Subject', fieldName: 'Subject'},
    {label: 'Priority', fieldName: 'Priority'},
    {label: 'Status', fieldName: 'Status'},
    {label: 'Duration (Days)', fieldName: 'Duration_in_Days__c'},
];

export default class CaseViewer extends LightningElement {

    @api recordId;
    columns = columns;
    caseRecords;
    @track hasCases = false;

    connectedCallback(){
        this.getCases();

    }

    async getCases(){
        GET_CASES({relatedAccountId: this.recordId})
        .then(result => {
            this.caseRecords = result;
            if (this.caseRecords.length > 0 ){
                this.hasCases = true;
            }
            console.log('these are the case records: '+ this.caseRecords);
        }) 
        .catch(error => {
            console.log('Error during getCases: '+ error.body.message);
        })
    }

}
