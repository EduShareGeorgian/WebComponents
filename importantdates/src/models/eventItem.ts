export default class EventItem {
  EventGuid: string;
  Title: string;
  Description: string;
  PublishedDate: Date;
  Link: URL;
  EventStartDate: Date;
  EventEndDate: Date;
  AllDayEvent: boolean;
  CollegeClosed: boolean;
  MoreInfoUrl: string;

  constructor() {    
  }
}