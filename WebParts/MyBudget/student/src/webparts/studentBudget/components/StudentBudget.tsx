import * as React from 'react';
import styles from './StudentBudget.module.scss';
import { IStudentBudgetProps } from './IStudentBudgetProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Tt } from './tt'



import { Example } from './Budget'


export default class StudentBudget extends React.Component<IStudentBudgetProps, void> {
  public render(): React.ReactElement<IStudentBudgetProps> {
    return (
      <div className={styles.studentBudget} style={{width:"1300px"}}>
       < Example/>
  
      </div>
    );
  }
}
