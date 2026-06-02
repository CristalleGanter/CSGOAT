public with sharing class caseViewerController {
    
    @AuraEnabled(cacheable = true)
    public static List<Case> getCases(Id relatedAccountId) {
        return [SELECT Id, Status, Subject, Priority, CreatedDate, Duration_in_Days__c 
            FROM Case WHERE AccountId = :relatedAccountId AND Status != 'Closed'
            ORDER BY Duration_in_Days__c DESC 
            LIMIT 50];
    }

    @AuraEnabled(cacheable = false)
    public static void closeCases(List<Case> openCases){
        for (Case currentCase: openCases) {
            currentCase.Status = 'Closed';
        }
        update openCases;
    }
}
