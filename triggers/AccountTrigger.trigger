trigger AccountTrigger on Account (after update) {

    if (Trigger.isAfter && Trigger.isUpdate){
        for (Account acc: Trigger.new){
            Account oldAcc = Trigger.oldMap.get(acc.Id);
            if (acc.Rating == 'Cold' && oldAcc.Rating == 'Hot'){
                AccountController.createAtRiskCase(Trigger.new);
            }
        }
    }


}
