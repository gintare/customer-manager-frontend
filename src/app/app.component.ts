import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from './customer.service';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'customermanagerapp';
  public customers: Customer[] = [];
  public editCustomer: Customer = {id:0,name:"",surname:"",birthDate:new Date(),phone:"",email:"", firstLetters:"", birthDayString:""};
  public deleteCustomer: Customer = {id:0,name:"",surname:"",birthDate:new Date(),phone:"",email:"", firstLetters:"", birthDayString:""};

  constructor(private customerService: CustomerService){}

  ngOnInit(){
    this.getCustomers();
  }

  public getCustomers(): void{
    this.customerService.getCustomers().subscribe(
      (response: Customer[]) => {
        this.customers = response;
        for(const customer of this.customers){
          customer.firstLetters = this.firstLettersFromNameAndSurname(customer.name, customer.surname);
          customer.birthDayString = this.birthDayToString(customer.birthDate);//"210-12-15";
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddCustomer1(): void {
     alert("submit form");
    // const input = document.getElementById("new_customer_name");
    // const value = input?.valu;
    const name = (<HTMLInputElement>document.getElementById("new_customer_name")).value;
    const new_customer_surname = (<HTMLInputElement>document.getElementById("new_customer_surname")).value;
    const new_customer_birthDate = (<HTMLInputElement>document.getElementById("new_customer_birthDate")).value;
    const new_customer_phone = (<HTMLInputElement>document.getElementById("new_customer_phone")).value;
    const new_customer_email = (<HTMLInputElement>document.getElementById("new_customer_email")).value;

     alert("submit form name = "+name);
     const customer1 = {
       id: 1,
       name: name,
       surname: new_customer_surname,
       birthDate: new Date(new_customer_birthDate),
       phone: new_customer_phone,
       email: new_customer_email,
       firstLetters: "AB",
       birthDayString: "2004-10-10"

     };
     alert("success1");
     this.customerService.addCustomer(customer1);
     alert("success2");
     this.customerService.addCustomer(customer1).subscribe(
       (response:Customer) => {
         alert("success");
         console.log(response);
         this.getCustomers();
       },
       (error: HttpErrorResponse) => {
        alert(error.message);
      }
     );
     alert("success3");
  }
 
  public onAddCustomer(addForm: NgForm): void {
    this.customerService.addCustomer(addForm.value).subscribe(
      (response:Customer) => {
        console.log(response);
        this.getCustomers();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
       alert(error.message);
       addForm.reset();
     }
    );    
    const container = document.getElementById('addCustomerModal'); 
    container?.setAttribute("style", "display: none;");    
  }

  public onUpdateCustomer(customer: Customer): void {
    customer = this.editCustomer;
    customer.name = (<HTMLInputElement>document.getElementById("customer_name_edit")).value;
    customer.surname = (<HTMLInputElement>document.getElementById("customer_surname_edit")).value;
    customer.phone = (<HTMLInputElement>document.getElementById("customer_phone_edit")).value;
    customer.email = (<HTMLInputElement>document.getElementById("customer_email_edit")).value;
    const birthDateEdit = (<HTMLInputElement>document.getElementById("customer_birthDate_edit")).value;
    customer.birthDate = new Date(birthDateEdit);
    this.customerService.updateCustomer(customer).subscribe(
      (response:Customer) => {
        console.log(response);
        this.getCustomers();
      },
      (error: HttpErrorResponse) => {
       alert(error.message);
     }
    );    
    const container = document.getElementById('updateCustomerModal'); 
    container?.setAttribute("style", "display: none;");    
  }
  
  public onOpenModal(customer: Customer, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addCustomerModal');
    }
    if(mode === 'edit'){
      button.setAttribute('data-target', '#updateCustomerModal');
    }
    if(mode === 'delete'){
      button.setAttribute('data-target', '#deleteCustomerModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onOpenModal1(mode: string): void{
    const container = document.getElementById('addCustomerModal'); 
    container?.setAttribute("style", "display: block;"); 
  }

  public onCloseModal(){
    const container = document.getElementById('addCustomerModal'); 
    container?.setAttribute("style", "display: none;"); 
  }

  public onOpenModalForUpdate(customer: Customer, mode: string): void{
    this.editCustomer = customer;
    const container = document.getElementById('updateCustomerModal'); 
    container?.setAttribute("style", "display: block;"); 
    //alert("Edit customer phone "+customer.phone);
    //(<HTMLInputElement>document.getElementById("customer_name_edit")).value=customer.name;
    //(<HTMLInputElement>document.getElementById("customer_surname_edit")).value=customer.surname;
    //(<HTMLInputElement>document.getElementById("customer_phone_edit")).value=customer.phone;
    //(<HTMLInputElement>document.getElementById("customer_email_edit")).value=customer.email;
    const birthDateEdit = customer.birthDate.toString().slice(0, 10);//"2010-05-30";
    //alert("date string = "+birthDateEdit);
    (<HTMLInputElement>document.getElementById("customer_birthDate_edit")).value=birthDateEdit;//"2010-05-30T18:27:09.000+00:00";
    
    
  }

  public onCloseModalForUpdate(){
    const container = document.getElementById('updateCustomerModal'); 
    container?.setAttribute("style", "display: none;"); 
  }

  public onCloseModalForDelete(){
    const container = document.getElementById('deleteCustomerModal'); 
    container?.setAttribute("style", "display: none;"); 
  }

  public searchCustomers(key: string):void{
    const results: Customer[] = [];
    for(const customer of this.customers){
        if(customer.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || customer.surname.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || customer.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || customer.email.toLowerCase().indexOf(key.toLowerCase()) !== -1){
           results.push(customer);
        }
    }
    this.customers = results;
    if(results.length === 0 || !key){
        this.getCustomers();
    }
  }

  public onOpenModalForDelete(customer: Customer): void{
    this.deleteCustomer = customer;
    const container = document.getElementById('deleteCustomerModal'); 
    container?.setAttribute("style", "display: block;"); 
  }

  public onDeleteCustomer(customer: Customer): void {
    customer = this.deleteCustomer;
    this.customerService.deleteCustomer(customer.id).subscribe(
      (response:void) => {
        console.log(response);
        this.getCustomers();
      },
      (error: HttpErrorResponse) => {
       alert(error.message);
     }
    );    
    const container = document.getElementById('deleteCustomerModal'); 
    container?.setAttribute("style", "display: none;");    
  }
  
  public firstLettersFromNameAndSurname(name: string, surname: string):string{
    if(!name || !surname){
       return "";
    }
    let letters = name.slice(0,1)+surname.slice(0, 1);
    return letters.toUpperCase();
  }

  public birthDayToString(date: Date):string{
    if(!date){
      return "";
    }
    return date.toString().slice(0,10);
  }
}
