public with sharing class caseViewerController {
    //add formula to cases to see how long it's been open
    @AuraEnabled(cacheable = true)
    public static List<Case> getCases(Id relatedAccountId) {
        try{
            return [SELECT Id, Status, Subject, Priority, CreatedDate, Duration_in_Days__c 
            FROM Case WHERE AccountId = :relatedAccountId AND Status != 'Closed'
            ORDER BY Duration_in_Days__c DESC 
            LIMIT 50];
        }
        catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        
    }
}
