export enum Term {
    None,
    Fall,
    Winter,
    Summer
}

export enum StatusQueue{
    None,
    O = "O", //offer
    R= "R", //refusal
    W = "W", //waitlisted
    NQ = "NQ" //no queue

}

export enum ActionLabel{
    None = "",
    CheckMyStatus = "Check My Status", //by default
    NoAction = "No Action", 
    PayMyDeposit = "Pay My Deposit", 
    ContactAdmissionOfficer = "Contact Admission Officer" ,
    AcceptMyOffer = "Accept My Offer"

}

export enum ActionLink{
    None = "",
    Banner = "https://georgiancollege.sharepoint.com/sites/go/Pages/BannerAppStatus.aspx", 
    OCAS = "http://www.ontariocolleges.ca/", 
    

}

export enum Message{
    None = "",
    msgAdmissionOfficer = "Please contact your Admissions Officer" 
    
    

}






