import { Component, Inject, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
// import data from '../assets/data.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  taskForm!: FormGroup;

  title = 'moneyManager';
  user = 'Ali Aman Khan';
  balance: any = 0;
  income: any = 0;
  expenses: any = 0;
  dataSource: any = [];
  statuses = [
    { value: 'Income', viewValue: 'Income' },
    { value: 'Expense', viewValue: 'Expense' },
  ];

  displayedColumns: string[] = ['title', 'amount', 'type', 'actions'];

  constructor(private frm: FormBuilder,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.taskForm = this.frm.group({
      id: Math.floor(Math.random() * 1000),
      title: '',
      amount: '',
      type: ''
    });
    this.loadDataFromLocalStorage(); //Loads the localStorage data in the dataSource on component initialization
    // this.filterValues(this.dataSource);
    // this.dataLet = this.dataSource;
  }

  // Function to load the localStorage data in the dataSource
  loadDataFromLocalStorage() {
    const storedData = localStorage.getItem('formData');
    const numericData = localStorage.getItem('numericData');
    if (storedData) {
      this.dataSource = JSON.parse(storedData);
    }
    if (numericData) {
      const { balance, income, expenses } = JSON.parse(numericData);
      this.balance = balance;
      this.income = income;
      this.expenses = expenses;
    }
  }

  // Function to save data in the localStorage of the dataSource
  saveToLocalStorage() {
    localStorage.setItem('formData', JSON.stringify(this.dataSource));
  }

  // Function called on the submition of the form
  onFormSubmit() {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;
      this.dataSource = [...this.dataSource, formData];
      localStorage.setItem('formData', JSON.stringify(this.dataSource));

      if (formData.type == 'Income') {
        this.income += formData.amount;
        this.balance += formData.amount;
      } else if (formData.type == 'Expense') {
        this.expenses += formData.amount;
        this.balance -= formData.amount;
      }

      localStorage.setItem('numericData', JSON.stringify({ balance: this.balance, income: this.income, expenses: this.expenses }));

      this.taskForm.reset();
      this.cdr.detectChanges(); // Manually trigger change detection
    }
  }

  // Function to delete the row
  deleteItem(rowIndex: number) {
    if (rowIndex >= 0 && rowIndex < this.dataSource.length) {
      // find the row data from the dataSource
      const row = this.dataSource[rowIndex];
      let numericDataFromStorage = JSON.parse(localStorage.getItem('numericData') ?? '') || {};
      if (numericDataFromStorage && row.type == 'Income') {
        this.balance = numericDataFromStorage.balance - row.amount;
        this.income = numericDataFromStorage.income - row.amount;
      } else if (numericDataFromStorage && row.type == 'Expense') {
        this.expenses = numericDataFromStorage.expenses - row.amount;
        this.balance = numericDataFromStorage.balance + row.amount;
      }
      localStorage.setItem('numericData', JSON.stringify({ balance: this.balance, income: this.income, expenses: this.expenses }));
      this.dataSource.splice(rowIndex, 1); // Remove the row at the specified index
      // update numeric data
      this.saveToLocalStorage();
      this.loadDataFromLocalStorage();
    }
  }
}
