/// <reference types="mocha" />
/// <reference types="sinon" />

import * as React from 'react';
import { assert, expect } from 'chai';
import { mount,shallow,configure } from 'enzyme';
import ProgramChoice from '../components/programChoice';
import * as ReactFifteenAdapter from 'enzyme-adapter-react-15.4';

configure({ adapter: new ReactFifteenAdapter() });
declare const sinon;

describe('<ProgramChoice /> with currentQueueType node', () => {
    const descTxt = "TestingThisOneOut";
    let programChoiceObj =   
    
    {
        
        "applAge": 21,
        "applicationNumber": "071643339",
        "banAdmInd": "Y",
        
        "oldScore": 12.4,
        "oogrCode": "DFLT",
        "oprgCode": "ECED",
        "pidm": 1009950,
        "prevYearApplied": 0,
        "prevYearAttended": 0,
        "progChoiceSeqNo": 1,
        "termCode": "200810",
        "year": "2007",
        "_transient": {
            "admissionSummary": {
                "_links": {
                    "self": {
                        "href": "https://api.georgiancollege.ca/programApi/application/ProgramAdmissionSummary/70967",
                        "hreflang": "en",
                        "type": "application/hal+json"
                    },
                    "feesOcas": {
                        "href": "https://api.georgiancollege.ca/programApi/FeesOcas/1697",
                        "hreflang": "en"
                    },
                    "programChoice": {
                        "href": "https://api.georgiancollege.ca/programApi/application/ProgramChoice/70967",
                        "hreflang": "en"
                    }
                },
                "admissionYear": "2007",
                
                "applicationNumber": "071643339",
                "bannerMajorCode": "ECED",
                "campusCode": "OR",
                "campusDesc": "Orillia",
                //"currentQueueType": "O",
                "dateProgramReceived": "2007-01-03T05:00:00Z",
                "depositPaid": "true",
                "dfltMaximumCcy": 110,
                "dfltMaximumOffers": 340,
                "dfltSeatCount": 100,
                "domesticAmount": 1525.66,
                "eligibilityFinalInd": "true",
                "equalConsDateInd": "false",
                "feesDueDate": "2007-06-22T04:00:00Z",
                "fullPartTime": "F",
                "hardDate": "2007-08-01T04:00:00Z",
                "internationalAmount": 5399.02,
                "intlMaximumCcy": 0,
                "intlMaximumOffers": 0,
                "intlSeatCount": 0,
                "lastUpdated": "2017-11-29T21:49:00Z",
                "newEligibilityDate": "2008-04-30T21:07:32Z",
                "newEligibilityInd": "true",
                "offerAccRefDate": "2007-02-22T05:00:00Z",
                "offerAcceptedInd": "true",
                "offerActiveDate": "2007-02-15T05:00:00Z",
                "offerExpiryDate": "2007-05-01T04:00:00Z",
                "depositDueDate": "2017-12-07T18:00:00Z",
                "registrationExpiryDate": "2017-12-07T18:00:00Z",
                "offerSentDate": "2007-07-17T20:59:50Z",
                "offerSentInd": "true",
                "paidFlag": "true",
                "pidm": 1009950,
                "programChoiceSequenceNumber": 1,
                "programCode": "ECED",
                "programDesc": "Early Childhood Education",
                "programType": "R",
                "queueActivityInd": "false",
                "registeredFlag": "true",
                "semester": 1,
                "startDate": 709,
                "status": "A",
                "studentRegistered": "true",
                "termCode": "200810",
                "_transient": {
                    "processState": {
                        "applied": "true",
                        "eligibilityMet": "true",
                        "refused": "false",
                        "waitListed": "false",
                        "offered": "true",
                        "reOffered": "false",
                        "noDeOffer": "false",
                        "offerOutstanding": "false",
                        "offerAccepted": "true",
                        "depositAcknowledged": "true",
                        "registered": "true"
                    }
                },
               
            }
        },
       
    };
    let componentDidMountSpy;
    let shallowRenderedElement;

    before(() => {
        componentDidMountSpy = sinon.spy(ProgramChoice.prototype, 'componentDidMount');
        shallowRenderedElement = mount(<ProgramChoice pchoice={programChoiceObj} />);
    });

    after(() => {
        componentDidMountSpy.restore();
    });

    // Write your tests here


    it('it is just a general test', () => {
            // general test
            expect(1==1).to.be.true;
        });

    it('<ProgramChoice/> should render "Not Available" as status when currentqueuetype node is not there', () => {
        // Check if the status is not availavle when it doesnt find currentqueuetype        
        expect(shallowRenderedElement.find('div.program_desc').text()).to.contain("Not Available");
    });

});

describe('<ProgramChoice /> without currentQueueType node', () => {
    const descTxt = "TestingThisOneOut";
    let programChoiceObj =   
    
    {
        
        "applAge": 21,
        "applicationNumber": "071643339",
        "banAdmInd": "Y",
        
        "oldScore": 12.4,
        "oogrCode": "DFLT",
        "oprgCode": "ECED",
        "pidm": 1009950,
        "prevYearApplied": 0,
        "prevYearAttended": 0,
        "progChoiceSeqNo": 1,
        "termCode": "200810",
        "year": "2007",
        "_transient": {
            "admissionSummary": {
                "_links": {
                    "self": {
                        "href": "https://api.georgiancollege.ca/programApi/application/ProgramAdmissionSummary/70967",
                        "hreflang": "en",
                        "type": "application/hal+json"
                    },
                    "feesOcas": {
                        "href": "https://api.georgiancollege.ca/programApi/FeesOcas/1697",
                        "hreflang": "en"
                    },
                    "programChoice": {
                        "href": "https://api.georgiancollege.ca/programApi/application/ProgramChoice/70967",
                        "hreflang": "en"
                    }
                },
                "admissionYear": "2007",
                
                "applicationNumber": "071643339",
                "bannerMajorCode": "ECED",
                "campusCode": "OR",
                "campusDesc": "Orillia",
                "currentQueueType": "O",
                "dateProgramReceived": "2007-01-03T05:00:00Z",
                "depositPaid": "true",
                "dfltMaximumCcy": 110,
                "dfltMaximumOffers": 340,
                "dfltSeatCount": 100,
                "domesticAmount": 1525.66,
                "eligibilityFinalInd": "true",
                "equalConsDateInd": "false",
                "feesDueDate": "2007-06-22T04:00:00Z",
                "fullPartTime": "F",
                "hardDate": "2007-08-01T04:00:00Z",
                "internationalAmount": 5399.02,
                "intlMaximumCcy": 0,
                "intlMaximumOffers": 0,
                "intlSeatCount": 0,
                "lastUpdated": "2017-11-29T21:49:00Z",
                "newEligibilityDate": "2008-04-30T21:07:32Z",
                "newEligibilityInd": "true",
                "offerAccRefDate": "2007-02-22T05:00:00Z",
                "offerAcceptedInd": "true",
                "offerActiveDate": "2007-02-15T05:00:00Z",
                "offerExpiryDate": "2007-05-01T04:00:00Z",
                "depositDueDate": "2017-12-07T18:00:00Z",
                "registrationExpiryDate": "2017-12-07T18:00:00Z",
                "offerSentDate": "2007-07-17T20:59:50Z",
                "offerSentInd": "true",
                "paidFlag": "true",
                "pidm": 1009950,
                "programChoiceSequenceNumber": 1,
                "programCode": "ECED",
                "programDesc": "Early Childhood Education",
                "programType": "R",
                "queueActivityInd": "false",
                "registeredFlag": "true",
                "semester": 1,
                "startDate": 709,
                "status": "A",
                "studentRegistered": "true",
                "termCode": "200810",
                "_transient": {
                    "processState": {
                        "applied": "true",
                        "eligibilityMet": "true",
                        "refused": "false",
                        "waitListed": "false",
                        "offered": "true",
                        "reOffered": "false",
                        "noDeOffer": "false",
                        "offerOutstanding": "false",
                        "offerAccepted": "true",
                        "depositAcknowledged": "true",
                        "registered": "true"
                    }
                },
               
            }
        },
       
    };
    let componentDidMountSpy;
    let shallowRenderedElement;

    before(() => {
        componentDidMountSpy = sinon.spy(ProgramChoice.prototype, 'componentDidMount');
        shallowRenderedElement = mount(<ProgramChoice pchoice={programChoiceObj} />);
    });

    after(() => {
        componentDidMountSpy.restore();
    });

    it('<ProgramChoice/> should not render "Not Available" as status when currentqueuetype node is there', () => {
        // Check if the status is not availavle when it doesnt find currentqueuetype        
        expect(shallowRenderedElement.find('div.program_desc').text()).to.not.contain("Not Available");
    });

});