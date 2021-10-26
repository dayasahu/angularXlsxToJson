import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'seat-allotment-app';

cells:any =[];
seatsPool:any=['10','22','3','4','5','6','7','8','9','11','12','13','14','15','16','17','18','19','20','21'];
occupied:boolean=false;
alreadyFilledSeats:any=[];
availableSeats:any=[];
onFileChange(event: any) {
  console.log('I am here');
  /* wire up file reader */
  const target: DataTransfer = <DataTransfer>(event.target);
  if (target.files.length !== 1) {
    throw new Error('Cannot use multiple files');
  }
  const reader: FileReader = new FileReader();
  reader.readAsBinaryString(target.files[0]);
  reader.onload = (e: any) => {
    /* create workbook */
    const binarystr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

    /* selected the first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.cells = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
    console.log(this.cells); // Data will be logged in array format containing objects

    for(let i=0;i<this.cells.length;i++){
      if(this.cells[i].AllotedSeat!=undefined){
      this.alreadyFilledSeats.push(this.cells[i].AllotedSeat)
      }
    }
  console.log(this.alreadyFilledSeats);

  for(let i=0;i<this.seatsPool.length;i++){
    this.occupied=false;
    for(let j=0;j<this.alreadyFilledSeats.length;j++){

      if(this.seatsPool[i]==this.alreadyFilledSeats[j]){
        console.log('I am occupied',this.seatsPool[i]);
        this.occupied=true;
      }
    }
    if(!this.occupied){
      console.log('I am not occupied',this.seatsPool[i]);
    this.availableSeats.push(this.seatsPool[i])
    }
  }
  console.log(this.availableSeats);
  };
}


allocateSeats(){
  
  for(let i=0;i<this.cells.length;i++){
    if(this.cells[i].AllotedSeat==undefined){
      this.cells[i].AllotedSeat=this.availableSeats[i];
    }}
   // this.cells = XLSX.utils.sheet_to_json(ws);
   console.log('new cells',this.cells);
   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.cells);
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'allotedSheet');
   XLSX.writeFile(wb, 'allotedSheet1.xlsx');

  console.log(this.availableSeats);
}
}
