import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  contact: any;
  contactId: number;
  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.contactService.selectedContact.subscribe(contact => (this.contact = contact));
    this.route.params
      .pipe(
        switchMap(({ id }) => {
          this.contactId = id;
          return this.contactService.getContact(id);
        })
      )
      .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(yes => {
      if (yes) {
        this.contactService.deleteContact(this.contactId).subscribe(() => {
          this.router.navigateByUrl('/contacts');
        });
      }
    });
  }
}
