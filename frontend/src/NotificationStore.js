// store.js
import { makeAutoObservable } from 'mobx';

class NotificationStore {
  errorText = '';
  successText = '';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setErrorText(text) {
    this.errorText = text;
  }

  setSuccessText(text) {
    this.successText = text;
  }

  resetErrorText() {
    this.errorText = '';
  }

  resetSuccessText() {
    this.successText = '';
  }
}

export default new NotificationStore();