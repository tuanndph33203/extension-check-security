import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
declare var chrome: any;

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  form: FormGroup;
  status= '';
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      toggle: [false],
      email: ['', [Validators.required, Validators.email]],
      remember: [true],
    });

    // ✅ Load dữ liệu form khi mở
    chrome.storage?.local?.get(['formData'], (result: any) => {
      if (result.formData) {
        this.form.patchValue(result.formData);
      }
    });
  }

  ngOnInit() {
    this.addWarningTag();
    this.form.valueChanges.subscribe(value => {
    chrome.storage.local.set({ formData: value });
     });
      this.form.get('toggle')?.valueChanges.subscribe(value => {

           chrome.storage.local.set({ enableTags: value });
      });
    
    chrome.storage?.local?.get(['enableTags'], (result: any) => {
      if (result && typeof result.enableTags !== 'undefined') {
        this.status = result.enableTags ? 'Bật' : 'Tắt';
        this.form.patchValue({ toggle: result.enableTags });
      }
    });
  }

  addWarningTag(): void {
    chrome.tabs?.query({}, (tabs: any) => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'ADD_TAG', label: 'Cảnh báo', color: 'red' });
        }
      }
    });
  }

  toggleTags(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    chrome.storage.local.set({ enableTags: checked });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      // ✅ Lưu toàn bộ formData vào local
      chrome.storage.local.set({ formData: data }, () => {
        console.log('Saved:', data);
        alert('Form saved!');
      });
    }
  }
}
