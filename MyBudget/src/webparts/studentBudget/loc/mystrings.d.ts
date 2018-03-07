declare interface IStudentBudgetStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  OnBudget: string;
  UnderBudget: string;
  OverBudget: string;
}

declare module 'studentBudgetStrings' {
  const strings: IStudentBudgetStrings;
  export = strings;
}
