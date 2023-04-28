public with sharing class TaskAssignmentManager {
    
    //method to get training task Ids
    private static List<Training_Task__c> getTrainingTaskIds(Id someProgram){
        List<Program_Task__c> progTaskIds = [SELECT Id, Training_Task__c, Training_Task__r.Name 
                                                FROM Program_Task__c 
                                                WHERE Training_Program__c = :someProgram];
        List<Training_Task__c> trainingTasks = new List<Training_Task__c>();
        for (Program_Task__c pt : progTaskIds){
            Training_Task__c tempTask = new Training_Task__c(
                Id = pt.Training_Task__c, 
                Name=pt.Training_Task__r.Name
            );

            trainingTasks.add(tempTask);
        }
        return trainingTasks;
    }

    //logic to create task assignments and assign proper values
    private static void createTaskAssignments(List<Training_Task__c> taskList, Program_Assignment__c progAssign ){
        List<Task_Assignment__c> toBeInserted = new List<Task_Assignment__c>();
        List<Program_Task__c> progList = [SELECT Id, Duration_Days__c 
                                        FROM Program_Task__c 
                                        WHERE Training_Program__c = :progAssign.Training_Program__c ];
        Integer count = 0;                           
        for (Training_Task__c tt: taskList){
                Program_Task__c progTask = progList[count];
                Task_Assignment__c taskAssignment = new Task_Assignment__c();
                String taskName = tt.Name;
                taskAssignment.Name = taskName;
                taskAssignment.Assigned_To__c = progAssign.Assigned_To__c;
                taskAssignment.Training_Task__c = tt.Id;
                taskAssignment.Program_Assignment__c = progAssign.Id;
            
                if (progAssign.Start_Date__c != NULL && progTask.Duration_Days__c != NULL){
                    Integer daysAdded = progTask.Duration_Days__c.intValue();   
                    System.debug('days added '+ daysAdded);
                    taskAssignment.Due_Date__c = ProgAssign.Start_Date__c.addDays(daysAdded);
                }
            count++;

            toBeInserted.add(taskAssignment);
        }
        insert toBeInserted;
    }

    //insert tasks
    public static void assignAllTasksFromProject(List<Program_Assignment__c> progAssigns){
        for (Program_Assignment__c assigns: progAssigns){
                List<Training_Task__c> trainingTasks = getTrainingTaskIds(assigns.Training_Program__c);
                createTaskAssignments(trainingTasks, assigns);
        }
    }
}
