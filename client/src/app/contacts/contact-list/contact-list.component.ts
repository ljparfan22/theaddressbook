import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: any[] = [];
  subscription: Subscription;
  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.subscription = this.contactService.contacts.subscribe(contacts => (this.contacts = contacts));
    this.contactService.fetchContacts().subscribe();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
