public with sharing class SiteTransferAccount {
    
    @InvocableMethod(label='Transfer Sites')
    public static void transferSites(List<wrapperClass> wrappedList){

        //first id from flow is new parent id
        String newParentId = wrappedList[0].SitesToTransfer[0];

        String removeParent = wrappedList[0].SitesToTransfer.remove(0);

        //call batch account process
        BatchSiteTransferAccount batchTransfer = new BatchSiteTransferAccount(newParentId, wrappedList[0].SitesToTransfer);
        Id batchId = Database.executeBatch(batchTransfer, 200);
    }

    public class wrapperClass{
        @invocableVariable
        public List<String> SitesToTransfer;
    }
}
