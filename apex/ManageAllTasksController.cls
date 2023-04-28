public with sharing class ManageAllTasksController {
  
  @AuraEnabled(Cacheable = true)
  public static List<Training_Task__c> searchTasks(String taskName){
    //code is getting tasks properly

    taskName = '%' + taskName + '%';
    List<Training_Task__c> returnedTasks =  [SELECT Id, Name, Level_of_Effort__c 
                                            FROM Training_Task__c 
                                            WHERE Name LIKE :taskName];
                                       
    System.debug('tasks returned with search: '+ returnedTasks);
    if(returnedTasks.isEmpty()) {
      throw new AuraHandledException('No Record Found..');
    }
    return returnedTasks;
  }

    @AuraEnabled
    public static void assignTasksToProject(Id projectId, Map<Id, String> taskWithDates){
        try{
          List<Id> ttIds = new List<Id>();
          List<Integer> days = new List<Integer>();
          for (Id key: taskWithDates.keySet()){
            Integer tempDays = Integer.valueOf(taskWithDates.get(key));
            System.debug('temp days '+tempDays);
            days.add(tempDays);
            ttIds.add(key);
          }
      
          List<Training_Task__c> myTasks = [SELECT Id, Name 
          FROM Training_Task__c WHERE Id IN :ttIds];

          List<Program_Task__c> progTasksToBeInserted = new List<Program_Task__c>();
          System.debug ('my tasks program tasks: '+ myTasks);

          for (Training_Task__c trainTask: myTasks){
            Program_Task__c pt = new Program_Task__c();
            pt.Training_Program__c = projectId;
            pt.Training_Task__c = trainTask.Id;
            pt.Duration_Days__c = Integer.valueOf(taskWithDates.get(trainTask.Id));

            progTasksToBeInserted.add(pt);  
            System.debug('pt duration days '+pt.Duration_Days__c);
          }

          insert progTasksToBeInserted;
        }
         catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
         }
    }
  
    public static List<Training_Task__c> sortTrainingTasks(Id projectId){
      List<Program_Task__c> progTaskList =    [SELECT Id, Name, Training_Task__c
                                              FROM Program_Task__c 
                                              WHERE Training_Program__c = :projectId
                                              ];
      Set<Id> idSet = new Set<Id>();
      for(Program_Task__c pt: progTaskList){
        idSet.add(pt.Id);
      }

      List<Training_Task__c> allTasksList =   [SELECT Id, Name, Level_of_Effort__c
                                              FROM Training_Task__c
                                              ];
      List<Training_Task__c> sortedTasks = new List<Training_Task__c>();
      List<Training_Task__c> existingTasks = new List<Training_Task__c>();
      for (Program_Task__c progTask: progTaskList){
          for (Training_Task__c trainTask: allTasksList){
            if (progTask.Training_Task__c == trainTask.Id){
                System.debug('inside loop '+progTask.Training_Task__c);
                existingTasks.add(trainTask);
            }
          }
      }
  
      for (Training_Task__c sortingTask: allTasksList){
            if( !existingTasks.contains(sortingTask)){
                sortedTasks.add(sortingTask);
            } 
      }
      
      return sortedTasks ;
    }
  
    @AuraEnabled(cacheable=true)
    public static List<Training_Task__c> getRelatedTasks(Id projectId){
        try {
          List<Training_Task__c> trainingList = sortTrainingTasks(projectId);
          return trainingList;
         } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
