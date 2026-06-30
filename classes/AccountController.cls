public with sharing class AccountController {


    public static void createAtRiskCase(List<Account> atRiskAccounts){
        List<Case> atRiskCases = new List<Case>();
        for (Account acc: atRiskAccounts){
            Case riskCase = new Case();
            riskCase.AccountId = acc.Id;
            riskCase.Priority = 'High';
            riskCase.Subject = 'Account At Risk';
            riskCase.Reason = 'Performance';
            atRiskCases.add(riskCase);
        }
        insert atRiskCases;

    }

}
