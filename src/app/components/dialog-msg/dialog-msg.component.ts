import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-msg',
  templateUrl: './dialog-msg.component.html',
  styleUrls: ['./dialog-msg.component.css']
})
export class DialogMsgComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
