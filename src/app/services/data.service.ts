import { MessageService } from 'primeng/api';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  sessionStorage: Storage;

  firestorePathPrefix: string = "stocks-portfolio/stocks-portfolio";

  public days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
  public months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

  constructor (private db: AngularFirestore, private messageService: MessageService) { 
    this.sessionStorage = window.sessionStorage;   
  }

  sendToastMessage(message: {}) {
    this.messageService.clear();
    this.messageService.add(message);
  }

  clearToastMessage() {
    this.messageService.clear();
  }

  getFirestoreCollection(collection: string) {
    return this.db.collection(`${this.firestorePathPrefix}/${collection}`).snapshotChanges();
  }

  getFirestoreCollectionWithWhere(collection: string, key: any, operation: any, value: any) {
    return this.db.collection(`${this.firestorePathPrefix}/${collection}`, ref => ref.where(key, operation, value)).snapshotChanges();
  }

  getFirestoreDocument(collection: string, documentID: string) {
    return this.db.collection(`${this.firestorePathPrefix}/${collection}`).doc(`${documentID}`).snapshotChanges();
  }

  createFirestoreDocumentWithID(collection: string, documentID: string, newDocument: any) {
    return this.db.collection(`${this.firestorePathPrefix}/${collection}`).doc(`${documentID}`).set(newDocument);
  }

  createFirestoreDocument(collection: string, newDocument: any) {
    return this.db.collection(`${this.firestorePathPrefix}/${collection}`).add(newDocument);
  }

  updateFirestoreDocument(collection: string, documentID: string, updatedDocument: any) {
    return this.db.collection(`${this.firestorePathPrefix}/${collection}`).doc(`${documentID}`).update(updatedDocument);
  }

  deleteFirestoreDocument(collection: string, documentID: string) {
    return this.db.collection(`${this.firestorePathPrefix}/${collection}`).doc(`${documentID}`).delete();
  }

  getStorageKey(key: string) {
    return JSON.parse(this.sessionStorage.getItem(key) as string);
  }

  createStorageKey(key: string, value: any) {
    this.sessionStorage.setItem(key, JSON.stringify(value));
  }

  deleteStorageKey(key: string) {
    this.sessionStorage.removeItem(key);
  }

  returnTime() {
    const today = new Date();
    const day = this.days[today.getDay()];
    const date = today.getDate();
    const month = this.months[today.getMonth()];
    const year = today.getFullYear();
    const hour = today.getHours();
    var minute: any = today.getMinutes();
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    return {
      day: day,
      month: month,
      date: date,
      year: year,
      hour: hour,
      minute: minute
    }
  }

  returnRandomID() {
    return Math.random().toString(36).replace('0.', '');
  }
}