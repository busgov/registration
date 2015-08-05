function HelpMeDecideCalculator() {
    this.companyWeight = 0;
    this.partnerWeight = 0;
    this.soletraderWeight = 0;
    this.calculateWeight = calculateWeight;

    this.manyOwners = 0;
    this.adminSensitive = 0;
    this.lawSuit = 0;
    this.fullControl = 0;
    this.hasPartner = 0;
    this.separateEntity = 0;

    this.superWeight = 100;

    // this is where the calculation happens
    // please note that 1 or 2 is just the option user made
    // 1 means user selected first option
    // 2 means user selected second option
    function calculateWeight() {

        // How many owners will your business have?
        if (this.manyOwners === 1) {
            this.companyWeight += 2;
            this.soletraderWeight += 2;
        }
        else if (this.manyOwners === 2) {
            this.companyWeight += 2;
            this.partnerWeight += 2;
        }


        // Do you want to minimise your record keeping and administrative requirements?
        if (this.adminSensitive == 1) {
            this.soletraderWeight += 1;
            this.partnerWeight += 1;
        }
        else if (this.adminSensitive === 2) {
            this.companyWeight += 1;
        }

        // Are you participating in an industry that is vulnerable to lawsuits?
        if (this.lawSuit === 1) {
            this.companyWeight += 1;
        }
        else if (this.lawSuit === 2) {
            this.soletraderWeight += 1;
            this.partnerWeight += 1;
        }

        // Do you want full control over your business decisions?
        if (this.fullControl === 1) {
            this.soletraderWeight += this.superWeight;
        }
        else if (this.fullControll === 2) {
        }

        // Do you and your partners want full control over your business decisions?
        if (this.hasPartner === 1) {
            this.partnerWeight += this.partnerWeight;
        }
        else if (this.hasPartner === 2) {

        }

        // Do you want to set up a separate entity for your business?
        if (this.separateEntity === 1) {

        }
        else if (this.separateEntity === 2) {
            this.companyWeight += this.superWeight;
        }

        var largestValue = 0;
        var weights = [this.companyWeight, this.partnerWeight, this.soletraderWeight];

        largestValue = Math.max.apply(Math, weights);

        var value = "";
        switch (largestValue) {
            case this.soletraderWeight:
                value = "soletrader"
                break;
            case this.companyWeight:
                value = "company";
                break;
            case this.partnerWeight:
                value = "partnership";
                break;
        }
        return value;
    }
}

